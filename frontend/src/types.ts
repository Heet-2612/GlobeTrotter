export interface UserResponse {
  id: number;
  name: string;
  email: string;
  profilePhoto?: string;
  languagePreference?: string;
  createdAt?: string;
}

export interface AuthResponse {
  token: string;
  user: UserResponse;
}

export interface SignupRequest {
  name: string;
  email: string;
  password: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ForgotPasswordResponse {
  message: string;
}

export interface ResetPasswordRequest {
  token: string;
  newPassword: string;
}

export interface TripResponse {
  id: number;
  name: string;
  description?: string;
  startDate: string;
  endDate: string;
  coverPhoto?: string;
  budget?: number;
  isPublic: boolean;
  shareToken?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateTripRequest {
  name: string;
  description?: string;
  startDate: string;
  endDate: string;
  coverPhoto?: string;
  budget?: number;
}

export interface UpdateTripRequest {
  name: string;
  description?: string;
  startDate: string;
  endDate: string;
  coverPhoto?: string;
  budget?: number;
}

export type DestinationType =
  | 'CITY' | 'TOWN' | 'REGION_CLUSTER' | 'ISLAND_ARCHIPELAGO'
  | 'NATIONAL_PARK' | 'HERITAGE_SITE' | 'PILGRIMAGE' | 'HILL_STATION'
  | 'BEACH' | 'CIRCUIT' | 'OTHER';

export type DestinationSource = 'CURATED' | 'GEOAPIFY' | 'USER_CREATED';

export interface RegionResponse {
  id: number;
  name: string;
  canonicalName: string;
  country: string;
  description?: string;
  imageUrl?: string;
}

export interface DestinationResponse {
  id: number;
  name: string;
  canonicalName?: string;
  country: string;
  regionId?: number;
  regionName?: string;
  region?: string;
  destinationType?: DestinationType;
  source?: DestinationSource;
  isCurated?: boolean;
  costIndex?: number;
  popularity?: number;
  imageUrl?: string;
  currencyCode?: string;
  currencySymbol?: string;
  latitude?: number;
  longitude?: number;
  aliases?: string[];
}

export type CityResponse = DestinationResponse;

export interface TripStopResponse {
  id: number;
  tripId: number;
  destination?: DestinationResponse;
  city: CityResponse;
  stopOrder: number;
  startDate: string;
  endDate: string;
  notes?: string;
}

export interface CreateTripStopRequest {
  destinationId?: number;
  cityId?: number;
  startDate: string;
  endDate: string;
  notes?: string;
}

export interface ActivityResponse {
  id: number;
  destinationId?: number;
  destinationName?: string;
  cityId?: number;
  cityName?: string;
  name: string;
  description?: string;
  category?: string;
  subcategoryId?: string;
  imageStrategy?: string;
  type?: string;
  estimatedDurationMinutes?: number;
  estimatedCost?: number;
  currency?: string;
  imageUrl?: string;
  googlePlaceId?: string;
  source?: 'CURATED' | 'LEGACY' | 'GEOAPIFY';
  externalId?: string;
  latitude?: number;
  longitude?: number;
}

export interface DiscoveredPlaceResponse {
  id: string;
  externalId?: string;
  name: string;
  description?: string;
  category?: string;
  latitude?: number;
  longitude?: number;
  address?: string;
  imageUrl?: string;
  source: 'GEOAPIFY';
  attribution?: string;
}

export interface AddDiscoveredActivityRequest {
  externalId: string;
  name: string;
  description?: string;
  category?: string;
  latitude?: number;
  longitude?: number;
  address?: string;
  imageUrl?: string;
  scheduledDate: string;
  startTime?: string;
  notes?: string;
  customCost?: number;
}

export interface TripActivityResponse {
  id: number;
  tripStopId: number;
  activity: ActivityResponse;
  scheduledDate: string;
  startTime?: string;
  notes?: string;
  customCost?: number;
  activityOrder: number;
}

export interface CreateTripActivityRequest {
  activityId: number;
  scheduledDate: string;
  startTime?: string;
  notes?: string;
  customCost?: number;
}

export interface CategoryCostSummary {
  category: string;
  totalCost: number;
  count: number;
}

export interface BudgetSummaryResponse {
  tripId: number;
  budget: number;
  totalActivityCost: number;
  remainingBudget: number;
  budgetUsedPercentage: number;
  budgetExceeded: boolean;
  currency: string;
  categoryBreakdown: CategoryCostSummary[];
}

export interface SetBudgetRequest {
  budget: number;
}

export interface TripSharingResponse {
  tripId: number;
  isPublic: boolean;
  shareToken?: string;
  publicUrl?: string;
}

export interface UpdateSharingRequest {
  isPublic: boolean;
}

export interface PublicTripActivityResponse {
  id: number;
  name: string;
  category: string;
  scheduledDate: string;
  startTime?: string;
  cost: number;
  currency: string;
}

export interface PublicTripStopResponse {
  id: number;
  cityName: string;
  country: string;
  startDate: string;
  endDate: string;
  notes?: string;
  activities: PublicTripActivityResponse[];
}

export interface PublicTripItineraryResponse {
  tripId: number;
  shareToken: string;
  name: string;
  description?: string;
  startDate: string;
  endDate: string;
  coverPhoto?: string;
  creatorName: string;
  budget?: number;
  stops: PublicTripStopResponse[];
}

export interface PlaceResponse {
  placeId: string;
  name: string;
  formattedAddress: string;
  latitude?: number;
  longitude?: number;
  rating?: number;
  googleMapsUri?: string;
  primaryType?: string;
  photoUrl?: string;
}

export interface PlaceAutocompleteResponse {
  placeId: string;
  text: string;
  secondaryText?: string;
}

export interface ExchangeRateResponse {
  baseCode: string;
  rates: Record<string, number>;
  lastUpdated: string;
  live?: boolean;
  source?: string;
}

export interface TripMemberResponse {
  id: number;
  tripId: number;
  userId?: number;
  fullName: string;
  isGtUser: boolean;
  role: 'OWNER' | 'MEMBER';
  status: 'ACTIVE' | 'INACTIVE';
  createdAt?: string;
}

export interface AddTripMemberRequest {
  gtUserId?: number;
  fullName?: string;
}

export type ExpenseCategory =
  | 'FOOD'
  | 'ACCOMMODATION'
  | 'TRANSPORT'
  | 'ACTIVITY'
  | 'SHOPPING'
  | 'TICKETS'
  | 'OTHER';

export type SplitType = 'EQUAL' | 'EXACT' | 'PERCENTAGE';

export interface ExpenseParticipantRequest {
  memberId: number;
  shareAmount?: number;
  percentage?: number;
}

export interface ExpensePayerRequest {
  memberId: number;
  paidAmount: number;
}

export interface ExpensePayerResponse {
  id?: number;
  memberId: number;
  memberFullName: string;
  paidAmount: number;
}

export interface CreateExpenseRequest {
  title: string;
  amount: number;
  currency?: string;
  category?: ExpenseCategory;
  expenseDate: string;
  splitType?: SplitType;
  payerMemberId?: number;
  payers?: ExpensePayerRequest[];
  tripActivityId?: number;
  notes?: string;
  participants: ExpenseParticipantRequest[];
}

export interface UpdateExpenseRequest {
  title: string;
  amount: number;
  currency?: string;
  category?: ExpenseCategory;
  expenseDate: string;
  splitType?: SplitType;
  payerMemberId?: number;
  payers?: ExpensePayerRequest[];
  tripActivityId?: number;
  notes?: string;
  participants: ExpenseParticipantRequest[];
}

export interface ExpenseParticipantResponse {
  id: number;
  memberId: number;
  fullName: string;
  isGtUser: boolean;
  userId?: number;
  shareAmount: number;
}

export interface ExpenseResponse {
  id: number;
  tripId: number;
  title: string;
  amount: number;
  currency: string;
  category: ExpenseCategory;
  expenseDate: string;
  splitType: SplitType;
  payer?: TripMemberResponse;
  isMultiplePayers?: boolean;
  payers?: ExpensePayerResponse[];
  createdByUserId: number;
  createdByName: string;
  isActivityLinked: boolean;
  tripActivityId?: number;
  activityName?: string;
  notes?: string;
  participants: ExpenseParticipantResponse[];
  createdAt?: string;
  updatedAt?: string;
}

export type BalanceStatus = 'GETS_BACK' | 'OWES' | 'SETTLED';

export interface MemberBalanceResponse {
  memberId: number;
  fullName: string;
  isGtUser: boolean;
  gtUserId?: number;
  role: string;
  memberStatus: string;
  totalPaid: number;
  totalOwed: number;
  netBalance: number;
  balanceStatus: BalanceStatus;
}

export interface DebtTransferResponse {
  fromMemberId: number;
  fromMemberName: string;
  toMemberId: number;
  toMemberName: string;
  amount: number;
}

export interface MyBalanceSummaryResponse {
  memberId: number;
  netBalance: number;
  balanceStatus: BalanceStatus;
  summaryMessage: string;
}

export interface TripBalanceResponse {
  tripId: number;
  currency: string;
  totalTripExpenses: number;
  memberBalances: MemberBalanceResponse[];
  simplifiedTransfers: DebtTransferResponse[];
  myBalanceSummary?: MyBalanceSummaryResponse;
}

export interface CreateSettlementRequest {
  payerMemberId: number;
  receiverMemberId: number;
  amount: number;
  currency?: string;
  settlementDate: string;
  notes?: string;
}

export interface SettlementResponse {
  id: number;
  tripId: number;
  payerMemberId: number;
  payerMemberName: string;
  receiverMemberId: number;
  receiverMemberName: string;
  amount: number;
  currency: string;
  settlementDate: string;
  notes?: string;
  createdByUserId: number;
  createdByName: string;
  createdAt: string;
}

export interface OverviewAnalytics {
  totalTripExpenses: number;
  expenseCount: number;
  averageExpenseAmount: number;
  totalSettlementVolume: number;
  settlementCount: number;
  totalOutstandingBalance: number;
}

export interface CategoryAnalytics {
  category: ExpenseCategory;
  totalAmount: number;
  expenseCount: number;
  percentage: number;
}

export interface MemberAnalytics {
  memberId: number;
  fullName: string;
  isGtUser: boolean;
  gtUserId?: number;
  memberStatus: string;
  totalPaid: number;
  totalOwed: number;
  expenseNetBalance: number;
  finalNetBalance: number;
  fundingPercentage: number;
}

export interface BudgetComparisonAnalytics {
  targetBudget: number | null;
  plannedItineraryCost: number;
  actualSpent: number;
  variance: number;
}

export interface TimelineAnalytics {
  date: string;
  totalAmount: number;
  expenseCount: number;
}

export interface TopExpenseAnalytics {
  id: number;
  title: string;
  category: ExpenseCategory;
  payerName: string;
  amount: number;
  expenseDate: string;
  activityName?: string;
}

export interface ExpenseSourceAnalytics {
  source: 'ACTIVITY' | 'CUSTOM';
  totalAmount: number;
  expenseCount: number;
  percentage: number;
}

export interface ActivitySpendingAnalytics {
  tripActivityId: number;
  activityName: string;
  category: string;
  plannedCost: number;
  actualSpent: number;
  expenseCount: number;
  variance: number;
}

export interface TripAnalyticsResponse {
  tripId: number;
  currency: string;
  overview: OverviewAnalytics;
  categoryBreakdown: CategoryAnalytics[];
  memberBreakdown: MemberAnalytics[];
  budgetComparison?: BudgetComparisonAnalytics;
  timeline: TimelineAnalytics[];
  topExpenses: TopExpenseAnalytics[];
  expenseSourceBreakdown: ExpenseSourceAnalytics[];
  activitySpending: ActivitySpendingAnalytics[];
  insights: string[];
}



