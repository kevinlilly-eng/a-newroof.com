export interface EmergencyIntakeData {
  homeownerName: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  damageType: 'WIND_STORM' | 'HAIL_IMPACT' | 'TREE_FALL' | 'ACTIVE_LEAK' | 'FIRE_STRUCTURAL';
  roofType: 'ASPHALT_SHINGLE' | 'METAL' | 'TILE' | 'FLAT_EPDM' | 'WOOD_SHAKE';
  stories: number;
  pitch: 'FLAT' | 'LOW_SLOPE' | 'MEDIUM_PITCH' | 'STEEP_PITCH';
  activeWaterLeak: boolean;
  notes: string;
}

export interface TriageResult {
  severityScore: number;
  urgencyCategory: 'CRITICAL' | 'URGENT' | 'STANDARD';
  hazardAssessment: string;
  recommendedEquipment: string[];
  homeownerInterimAdvice: string[];
  contractorPrioritization: Array<{
    contractorId: string;
    companyName: string;
    suitabilityScore: number;
    matchingReason: string;
  }>;
  dispatchRecommendationNotes: string;
}

export interface EstimateLineItem {
  category: string;
  item: string;
  quantity: number;
  unit: string;
  unitRate: number;
  totalPrice: number;
  codeRef?: string;
}

export interface EstimateResult {
  summary: string;
  wasteFactorPercentage: number;
  lineItems: EstimateLineItem[];
  subtotal: number;
  overheadAndProfitRate: number;
  overheadAndProfitAmount: number;
  estimatedTax: number;
  grandTotal: number;
  geminiSuggestionsAndThoughts: string[];
  carrierDefenseNotes: string;
}

export interface SupplementReportResult {
  reportTitle: string;
  policyholder: string;
  claimNumber: string;
  carrier: string;
  lossDate: string;
  executiveSummary: string;
  supplementLineItems: Array<{
    xactimateCode: string;
    description: string;
    quantity: string;
    unitPrice: number;
    supplementTotal: number;
    codeJustification: string;
  }>;
  totalSupplementAmount: number;
  buildingCodeCitations: Array<{
    codeRef: string;
    title: string;
    requirementText: string;
  }>;
  adjusterRebuttalPoints: string[];
  formalConclusion: string;
}

export interface ContractorCrew {
  id: string;
  companyName: string;
  phone: string;
  city: string;
  rating: number;
  reviewsCount: number;
  verified247: boolean;
  specialties: string[];
  distanceMiles: number;
  activeCrewsAvailable: number;
}
