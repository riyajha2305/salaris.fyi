export interface CreateSalaryInput {
  company: string;
  role: string;
  location: string;
  yearsOfExperience?: string;
  baseSalary?: string;
  bonus?: string;
  stockCompensation?: string;
  totalCompensation: string;
  type: "fulltime" | "internship" | "university";
  employmentType?: "Full-time" | "Internship";
}

export interface SalaryRecord {
  id: string;
  company_name: string;
  designation: string;
  location: string;
  years_of_experience: number | null;
  avg_salary: number | null;
  data_points_count: number | null;
  base_salary?: number | null;
  bonus?: number | null;
  stock_compensation?: number | null;
  total_compensation?: number | null;
  upvotes?: number | null;
  downvotes?: number | null;
}


