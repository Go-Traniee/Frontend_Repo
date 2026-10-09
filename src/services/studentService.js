const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const getStudentProfile = async () => {
  try {
    const token = localStorage.getItem("auth_token");

    const response = await fetch(`${BASE_URL}/student/profile`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || "Failed to fetch profile.");
    }

    return result.data;
  } catch (error) {
    throw error;
  }
};

export const updateStudentProfile = async (profileData) => {
  try {
    const token = localStorage.getItem("auth_token");

    const response = await fetch(`${BASE_URL}/student/profile`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(profileData),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || "Failed to update profile.");
    }

    return result.data;
  } catch (error) {
    throw error;
  }
};

export const getAvailableSkills = async () => {
  try {
    const token = localStorage.getItem("auth_token");

    const response = await fetch(`${BASE_URL}/skills`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || "Failed to fetch skills.");
    }

    return result.data;
  } catch (error) {
    throw error;
  }
};

export const getStudentSkills = async () => {
  try {
    const token = localStorage.getItem("auth_token");

    const response = await fetch(`${BASE_URL}/student/skills`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || "Failed to fetch student skills.");
    }

    return result.data;
  } catch (error) {
    throw error;
  }
};

export const addStudentSkill = async ({ skill_id, proficiency }) => {
  try {
    const token = localStorage.getItem("auth_token");

    const response = await fetch(`${BASE_URL}/student/skills`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ skill_id, proficiency }),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || "Failed to add skill.");
    }

    return result.data;
  } catch (error) {
    throw error;
  }
};

export const getStudentEvidence = async () => {
  try {
    const token = localStorage.getItem("auth_token");

    const response = await fetch(`${BASE_URL}/student/evidence`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || "Failed to fetch evidence.");
    }

    return result.data;
  } catch (error) {
    throw error;
  }
};
export const getStudentAvailability = async () => {
  try {
    const token = localStorage.getItem("auth_token");

    const response = await fetch(`${BASE_URL}/student/availability`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || "Failed to fetch availability.");
    }

    return result.data;
  } catch (error) {
    throw error;
  }
};

export const updateStudentAvailability = async (availabilityData) => {
  try {
    const token = localStorage.getItem("auth_token");

    const response = await fetch(`${BASE_URL}/student/availability`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(availabilityData),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || "Failed to update availability.");
    }

    return result.data;
  } catch (error) {
    throw error;
  }
};
export const deleteStudentSkill = async (studentSkillId) => {
  try {
    const token = localStorage.getItem("auth_token");

    const response = await fetch(`${BASE_URL}/student/skills/${studentSkillId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const result = await response.json();
      throw new Error(result.message || "Failed to delete skill.");
    }

    return true;
  } catch (error) {
    throw error;
  }
};

export const updateStudentSkillLevel = async (studentSkillId, proficiency) => {
  try {
    const token = localStorage.getItem("auth_token");

    const response = await fetch(`${BASE_URL}/student/skills/${studentSkillId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ proficiency }),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || "Failed to update skill level.");
    }

    return result.data;
  } catch (error) {
    throw error;
  }
};

export const getStudentAssessmentResults = async () => {
  try {
    const token = localStorage.getItem("auth_token");

    const response = await fetch(`${BASE_URL}/student/assessments`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || "Failed to fetch assessment results.");
    }

    return result.data;
  } catch (error) {
    throw error;
  }
};

export const getInitialAssessment = async () => {
  try {
    const token = localStorage.getItem("auth_token");
    const response = await fetch(`${BASE_URL}/assessments/initial`, {
      method: "GET",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    const result = await response.json();
    if (!response.ok) throw new Error(result.message || "Failed to fetch assessment.");
    return result.data;
  } catch (error) {
    throw error;
  }
};

export const submitInitialAssessment = async (answers) => {
  try {
    const token = localStorage.getItem("auth_token");
    const response = await fetch(`${BASE_URL}/assessments/initial/submit`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ answers }),
    });

    const result = await response.json();
    if (!response.ok) throw new Error(result.message || "Failed to submit assessment.");
    return result.data;
  } catch (error) {
    throw error;
  }
};
export const getSkillsInsights = async () => {
  try {
    const token = localStorage.getItem("auth_token");

    const response = await fetch(`${BASE_URL}/student/skills/insights`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || "Failed to fetch skills insights.");
    }

    return result.data;
  } catch (error) {
    throw error;
  }
};

export const uploadStudentAvatar = async (file) => {
  try {
    const token = localStorage.getItem("auth_token");

    const formData = new FormData();
    formData.append("avatar", file);

    const response = await fetch(`${BASE_URL}/student/avatar`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || "Failed to upload avatar.");
    }

    return result.data;
  } catch (error) {
    throw error;
  }
};