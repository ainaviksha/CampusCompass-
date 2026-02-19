/**
 * College Recommendation Engine
 *
 * Scores and ranks colleges based on student profile data.
 * Uses a multi-factor scoring approach:
 *   1. Exam Match      — college accepts exams the student has taken
 *   2. State Proximity — same state as the student's home state
 *   3. Affordability   — lower fees get a slight boost
 *   4. Score Fit       — estimate if student's score is competitive for the college
 *   5. Quality         — rating + placement % as tiebreakers
 */

// Mapping from form keys to the exam names used in college.entranceExams
const EXAM_KEY_TO_NAME = {
    jeePercentile: ['JEE Main', 'JEE Mains', 'JEE Advanced'],
    bitsatScore: ['BITSAT'],
    comedkRank: ['COMEDK'],
    viteeeRank: ['VITEEE'],
    kcetRank: ['KCET'],
    mhtcetPercentile: ['MHT-CET', 'MHT CET'],
    eapcetRank: ['EAPCET', 'AP EAPCET'],
    srmjeeRank: ['SRMJEE'],
    wbjeeRank: ['WBJEE'],
};

/**
 * Parse the fees string (e.g. "₹21.5 Lakhs (4 years)") into a numeric value in lakhs.
 */
function parseFees(feesStr) {
    if (!feesStr) return null;
    const match = feesStr.match(/₹?([\d.]+)/);
    return match ? parseFloat(match[1]) : null;
}

/**
 * Get the set of exam names that the student has actually filled in.
 */
function getStudentExams(formData) {
    const exams = new Set();
    for (const [key, examNames] of Object.entries(EXAM_KEY_TO_NAME)) {
        const value = formData[key];
        if (value && String(value).trim() !== '') {
            examNames.forEach(name => exams.add(name.toLowerCase()));
        }
    }
    return exams;
}

/**
 * Score a single college for a student.
 * Returns a numeric score (higher = better match).
 */
function scoreCollege(college, studentExams, homeState) {
    let score = 0;

    // 1. Exam Match (0–40 points)
    // If the college accepts an exam the student has taken, it's highly relevant.
    const collegeExams = (college.entranceExams || []).map(e => e.toLowerCase());
    let examMatchCount = 0;
    for (const exam of collegeExams) {
        if (studentExams.has(exam)) {
            examMatchCount++;
        }
        // Also check partial matches (e.g. "JEE Main" matches "jee main" or "jee mains")
        for (const studentExam of studentExams) {
            if (exam.includes(studentExam) || studentExam.includes(exam)) {
                examMatchCount++;
                break;
            }
        }
    }
    // Cap at 40 points, with diminishing returns
    score += Math.min(examMatchCount * 15, 40);

    // 2. State Proximity (0–15 points)
    if (homeState && college.state) {
        if (college.state.toLowerCase() === homeState.toLowerCase()) {
            score += 15;
        }
    }

    // 3. Affordability (0–10 points)
    // Lower fees = higher score in this dimension
    const fees = parseFees(college.fees);
    if (fees !== null) {
        if (fees <= 5) score += 10;
        else if (fees <= 15) score += 7;
        else if (fees <= 25) score += 4;
        else score += 1;
    }

    // 4. Quality factors (0–25 points)
    // Placement percentage
    if (college.placementPercent) {
        score += Math.min((college.placementPercent / 100) * 15, 15);
    }

    // Rating
    if (college.rating) {
        score += (college.rating / 5) * 10;
    }

    // 5. NIRF Ranked bonus (0–10 points)
    if (college.nirfRank) {
        if (college.nirfRank <= 10) score += 10;
        else if (college.nirfRank <= 50) score += 7;
        else if (college.nirfRank <= 100) score += 4;
        else score += 2;
    }

    return score;
}

/**
 * Get recommended colleges sorted by relevance score.
 *
 * @param {Array} colleges - All available colleges
 * @param {Object|null} formData - Student form data from sessionStorage (can be null)
 * @param {number} limit - Max number of recommendations to return
 * @returns {Array} - Sorted array of recommended colleges
 */
export function getRecommendedColleges(colleges, formData, limit = 6) {
    // No student data → return top-rated colleges as default recommendations
    if (!formData) {
        return [...colleges]
            .sort((a, b) => (b.rating || 0) - (a.rating || 0))
            .slice(0, limit);
    }

    const studentExams = getStudentExams(formData);
    const homeState = formData.homeState || '';

    // If student hasn't filled any exams or state, fall back to rating-based
    if (studentExams.size === 0 && !homeState) {
        return [...colleges]
            .sort((a, b) => (b.rating || 0) - (a.rating || 0))
            .slice(0, limit);
    }

    // Score and sort all colleges
    const scored = colleges.map(college => ({
        college,
        score: scoreCollege(college, studentExams, homeState),
    }));

    scored.sort((a, b) => b.score - a.score);

    return scored.slice(0, limit).map(s => s.college);
}
