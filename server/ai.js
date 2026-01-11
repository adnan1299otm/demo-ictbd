const {
  getCourses,
  getCourseLevels,
  getPrograms,
  getAdmissions,
  getServices,
} = require("./db");

const { askGemini } = require("./gemini");

function emptyResponse() {
  return "This information is not available at the moment.";
}

async function buildKnowledgeContext() {
  const courses = await getCourses();
  const programs = await getPrograms();
  const admissions = await getAdmissions();
  const services = await getServices();

  if (
    courses.length === 0 &&
    programs.length === 0 &&
    admissions.length === 0 &&
    services.length === 0
  ) {
    return null;
  }

  let context = "";

  for (const course of courses) {
    context += `Course: ${course.course_name}\n`;
    const levels = await getCourseLevels(course.id);
    levels.forEach(level => {
      context += `Level ${level.level}: ${level.title}\n`;
      context += `${level.description}\n\n`;
    });
  }

  programs.forEach(p => {
    context += `Program: ${p.program_name}\n${p.description}\n\n`;
  });

  admissions.forEach(a => {
    context += `Admissions:\nEligibility: ${a.eligibility}\nProcess: ${a.process}\n\n`;
  });

  services.forEach(s => {
    context += `Service: ${s.service_name}\n${s.description}\n\n`;
  });

  return context;
}

async function handleAIMessage(userMessage) {
  const context = await buildKnowledgeContext();
  if (!context) return emptyResponse();
  return await askGemini(context, userMessage);
}

module.exports = { handleAIMessage };
