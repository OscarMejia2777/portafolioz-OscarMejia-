
export interface Project {
  id: string;
  title: string;
  description: string;
  tags: string[];
  imageUrl: string;
  category: 'E-Commerce' | 'Fintech' | 'Web3' | 'Dashboards' | 'All';
}

export interface Skill {
  name: string;
  level: string;
  experience: string;
  icon: string;
}

export interface Experience {
  role: string;
  company: string;
  period: string;
  description: string;
  achievements: string[];
  isCurrent: boolean;
}
