import { ParameterItem } from '../services/parameterService';

export const getLabel = (items: ParameterItem[], code: string | null | undefined, language: 'en' | 'fr' = 'en'): string => {
  if (!code) return '';
  const item = items.find(i => i.code === code);
  if (!item) return code;
  return language === 'fr' ? (item.labelFr || item.labelEn) : item.labelEn;
};


