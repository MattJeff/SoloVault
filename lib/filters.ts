import { Project } from './types';

interface Filters {
  revenue: string;
  mvp: string | null;
  solo: boolean;
  search: string;
}

export function filterProjects(projects: Project[], filters: Filters): Project[] {
  return projects.filter(project => {
    // Revenue filter
    if (filters.revenue !== 'all') {
      const revenue = project.revenue;
      if (filters.revenue === '1M+' && revenue < 1000000) return false;
      if (filters.revenue === '500K-1M' && (revenue < 500000 || revenue >= 1000000)) return false;
      if (filters.revenue === '100K-500K' && (revenue < 100000 || revenue >= 500000)) return false;
    }

    // MVP filter
    if (filters.mvp) {
      const mvpLower = project.mvp.toLowerCase();
      if (filters.mvp === 'weekend' && !mvpLower.includes('weekend')) return false;
      if (filters.mvp === 'week' && !mvpLower.includes('week') && !mvpLower.includes('weeks')) return false;
    }

    // Solo filter
    if (filters.solo) {
      const soloLower = project.stillSolo.toLowerCase();
      if (!soloLower.includes('yes') && !soloLower.includes('still solo')) return false;
    }

    // Search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      const searchable = `
        ${project.name} 
        ${project.industry} 
        ${project.problem} 
        ${project.solution} 
        ${project.productType}
        ${project.developer}
      `.toLowerCase();
      
      if (!searchable.includes(searchLower)) return false;
    }

    return true;
  });
}

export function formatRevenue(revenue: number): string {
  if (revenue >= 1000000) {
    return `${(revenue / 1000000).toFixed(1)}M`;
  } else if (revenue >= 1000) {
    return `${(revenue / 1000).toFixed(0)}K`;
  }
  return revenue.toString();
}

export function getProjectIcon(industry: string): string {
  const icons: Record<string, string> = {
    'E-commerce': '🛒',
    'Sales': '💼',
    'Social Media': '📱',
    'Software': '💻',
    'Marketing': '📈',
    'Design': '🎨',
    'Development': '⚙️',
    'Analytics': '📊',
    'Communication': '💬',
    'Productivity': '✅',
    'Finance': '💰',
    'Education': '📚'
  };
  
  return icons[industry] || '💎';
}
