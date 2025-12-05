/**
 * Convert text to URL-friendly slug
 * @param text - Text to slugify
 * @returns URL-friendly slug
 */
export function slugify(text: string): string {
  if (!text) return '';
  
  return text
    .toLowerCase()
    .trim()
    // Remove special characters except spaces and hyphens
    .replace(/[^\w\s-]/g, '')
    // Replace spaces and multiple hyphens with single hyphen
    .replace(/[\s_-]+/g, '-')
    // Remove leading and trailing hyphens
    .replace(/^-+|-+$/g, '');
}

/**
 * Generate SEO-friendly URL for salary entry
 * @param data - Salary data object
 * @returns URL path like /salaries/[company]/[designation]/[location]/[id]
 */
export function generateSalaryUrl(data: {
  company_name?: string;
  company?: string;
  designation?: string;
  role?: string;
  location: string;
  id: string;
}): string {
  const company = slugify(data.company_name || data.company || 'company');
  const designation = slugify(data.designation || data.role || 'role');
  const location = slugify(data.location || 'location');
  const id = data.id; // UUID stays as-is
  
  return `/salaries/${company}/${designation}/${location}/${id}`;
}

