import { CreateSalaryInput, SalaryRecord } from "./types";
import { insertSalary } from "./repository";

function toNumberOrNull(value?: string): number | null {
  if (value === undefined || value === null || value === "") return null;
  const parsed = Number(value);
  return Number.isNaN(parsed) ? null : parsed;
}

export async function createSalaryFromUserInput(
  input: CreateSalaryInput
): Promise<SalaryRecord> {
  const {
    company,
    role,
    location,
    yearsOfExperience,
    baseSalary,
    bonus,
    stockCompensation,
    totalCompensation,
    type,
    employmentType,
  } = input;

  if (!company || !role || !location || !totalCompensation) {
    throw new Error("Missing required fields");
  }

  const totalComp = Number(totalCompensation);
  if (Number.isNaN(totalComp) || totalComp <= 0) {
    throw new Error("Invalid total compensation");
  }

  const jobType =
    type === "internship"
      ? "internship"
      : employmentType === "Internship"
      ? "internship"
      : "full-time";

  const yearsOfExpNumber =
    type === "fulltime" ? toNumberOrNull(yearsOfExperience) : null;

  const payload = {
    company_name: company,
    designation: role,
    location,
    years_of_experience: yearsOfExpNumber,
    base_salary: toNumberOrNull(baseSalary),
    bonus: toNumberOrNull(bonus) ?? 0,
    stock_compensation: toNumberOrNull(stockCompensation) ?? 0,
    total_compensation: totalComp,
    avg_salary: totalComp,
    min_salary: totalComp,
    max_salary: totalComp,
    data_points_count: 1,
    source_platform: "manual",
    job_type: jobType,
    currency: "INR",
  };

  return insertSalary(payload);
}


