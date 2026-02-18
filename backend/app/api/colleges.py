from typing import List, Optional
from fastapi import APIRouter, Body, Request, HTTPException, status, Depends, UploadFile, File
from app.models.college import CollegeCreate, CollegeUpdate, CollegeInDB
from app.core.database import get_database
from app.api.deps import get_current_user
from app.models.user import UserInDB

router = APIRouter()

@router.get("/", response_description="List all colleges", response_model=List[CollegeInDB])
async def list_colleges(limit: int = 100, skip: int = 0):
    db = get_database()
    colleges = await db.colleges.find().skip(skip).limit(limit).to_list(limit)
    return colleges

@router.get("/export", response_description="Export colleges")
async def export_colleges():
    import pandas as pd
    import io
    from fastapi.responses import StreamingResponse
    
    db = get_database()
    colleges = await db.colleges.find().to_list(10000)
    
    if not colleges:
        return {"message": "No data to export"}

    # Flatten coordinates if needed?
    data_list = []
    for c in colleges:
        c_dict = dict(c)
        if "_id" in c_dict: del c_dict["_id"]
        if "mongo_id" in c_dict: del c_dict["mongo_id"]
        
        # Flatten coords
        if "coordinates" in c_dict and c_dict["coordinates"]:
            coords = c_dict.pop("coordinates")
            if isinstance(coords, dict):
                c_dict["lat"] = coords.get("lat")
                c_dict["lng"] = coords.get("lng")
        
        # Join lists
        list_fields = ["topRecruiters", "accreditation", "entranceExams", "courses"]
        for field in list_fields:
            if field in c_dict and isinstance(c_dict[field], list):
                c_dict[field] = ", ".join(c_dict[field])
                
        data_list.append(c_dict)

    df = pd.DataFrame(data_list)
    stream = io.StringIO()
    df.to_csv(stream, index=False)
    
    response = StreamingResponse(iter([stream.getvalue()]), media_type="text/csv")
    response.headers["Content-Disposition"] = "attachment; filename=colleges.csv"
    return response

@router.get("/{id}", response_description="Get a single college", response_model=CollegeInDB)
async def show_college(id: str):
    db = get_database()
    # Try custom ID first
    college = await db.colleges.find_one({"id": id})
    if college is None:
        raise HTTPException(status_code=404, detail=f"College {id} not found")
    return college

@router.post("/", response_description="Add new college", response_model=CollegeInDB)
async def create_college(college: CollegeCreate, current_user: UserInDB = Depends(get_current_user)):
    db = get_database()
    # Check if ID exists
    existing = await db.colleges.find_one({"id": college.id})
    if existing:
        raise HTTPException(status_code=400, detail=f"College with ID {college.id} already exists")
    
    # Exclude mongo_id from input, let Mongo generate it
    college_data = college.model_dump(by_alias=True, exclude={"mongo_id"})
    
    new_college = await db.colleges.insert_one(college_data)
    created_college = await db.colleges.find_one({"_id": new_college.inserted_id})
    return created_college

@router.put("/{id}", response_description="Update a college", response_model=CollegeInDB)
async def update_college(id: str, college: CollegeUpdate, current_user: UserInDB = Depends(get_current_user)):
    db = get_database()
    
    # Filter out None values to allow partial updates (though CollegeUpdate fields are optional)
    update_data = college.model_dump(exclude_unset=True)
    
    # If update_data is empty, just return existing
    if not update_data:
         existing = await db.colleges.find_one({"id": id})
         if existing: return existing
         raise HTTPException(status_code=404, detail=f"College {id} not found")

    update_result = await db.colleges.update_one(
        {"id": id}, {"$set": update_data}
    )
    
    if update_result.modified_count == 1:
        updated_college = await db.colleges.find_one({"id": id})
        if updated_college is not None:
            return updated_college
    
    existing = await db.colleges.find_one({"id": id})
    if existing:
        return existing
    
    raise HTTPException(status_code=404, detail=f"College {id} not found")

@router.delete("/{id}", response_description="Delete a college")
async def delete_college(id: str, current_user: UserInDB = Depends(get_current_user)):
    db = get_database()
    delete_result = await db.colleges.delete_one({"id": id})
    if delete_result.deleted_count == 1:
        return {"message": "College deleted successfully"}
    raise HTTPException(status_code=404, detail=f"College {id} not found")

@router.post("/import", response_description="Import colleges from CSV/Excel")
async def import_colleges(file: UploadFile = File(...), current_user: UserInDB = Depends(get_current_user)):
    import pandas as pd
    import io
    
    contents = await file.read()
    if file.filename.endswith('.csv'):
        df = pd.read_csv(io.BytesIO(contents))
    elif file.filename.endswith(('.xls', '.xlsx')):
        df = pd.read_excel(io.BytesIO(contents))
    else:
        raise HTTPException(status_code=400, detail="Invalid file format")
    
    db = get_database()
    results = {"inserted": 0, "updated": 0, "errors": []}
    
    for _, row in df.iterrows():
        try:
            data = row.to_dict()
            # Clean NaN
            data = {k: v for k, v in data.items() if pd.notna(v)}
            
            if "id" not in data:
                results["errors"].append(f"Row {_}: Missing ID")
                continue
            
            # Handle list fields (assume comma separated strings in CSV)
            list_fields = ["topRecruiters", "accreditation", "entranceExams", "courses"]
            for field in list_fields:
                if field in data and isinstance(data[field], str):
                    data[field] = [x.strip() for x in data[field].split(",")]
            
            # Upsert
            existing = await db.colleges.find_one({"id": data["id"]})
            if existing:
                await db.colleges.update_one({"id": data["id"]}, {"$set": data})
                results["updated"] += 1
            else:
                # Validate with Create model (might fail if fields missing)
                # Ideally validation happens here.
                # We'll try to insert raw for flexibility or use model logic if strict
                # Using model logic is safer.
                try:
                    # We might need to handle coordinates separately if flattened in CSV (lat, lng columns)
                    if "coordinates" not in data and "lat" in data and "lng" in data:
                        data["coordinates"] = {"lat": data.pop("lat"), "lng": data.pop("lng")}
                    
                    # Create model
                    # college_in = CollegeCreate(**data)
                    # For now just insert data, let's trust admin or basic validation
                    
                    await db.colleges.insert_one(data)
                    results["inserted"] += 1
                except Exception as e:
                    results["errors"].append(f"ID {data['id']}: {str(e)}")

        except Exception as e:
            results["errors"].append(f"Row Error: {str(e)}")
            
    return results


