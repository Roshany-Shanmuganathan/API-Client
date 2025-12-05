import apiClient from '@/utils/axios';
import type {
  ApiResponse,
  OfferBrowseResponse,
  OfferResponse,
  ReviewsResponse,
  Review,
  Offer,
} from '@/types';

export const browseOffers = async (params?: {
  category?: string;
  city?: string;
  search?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
}): Promise<OfferBrowseResponse> => {
  const response = await apiClient.get<ApiResponse<OfferBrowseResponse>>('/offers', {
    params,
  });
  return response.data.data;
};

export const getOffer = async (id: string): Promise<OfferResponse> => {
  const response = await apiClient.get<ApiResponse<OfferResponse>>(`/offers/${id}`);
  return response.data.data;
};

export const getOfferReviews = async (offerId: string): Promise<ReviewsResponse> => {
  const response = await apiClient.get<ApiResponse<ReviewsResponse>>(
    `/offers/${offerId}/reviews`
  );
  return response.data.data;
};

export const clickOffer = async (id: string): Promise<void> => {
  await apiClient.post(`/offers/${id}/click`);
};

export const fetchOffersServer = async (limit: number = 10): Promise<Offer[]> => {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
    const response = await fetch(`${baseUrl}/offers?limit=${limit}`, {
      cache: 'no-store',
    });

    if (!response.ok) {
      throw new Error('Failed to fetch offers');
    }

    const data: ApiResponse<OfferBrowseResponse> = await response.json();
    return data.data.offers;
  } catch (error) {
    console.error('Error fetching offers:', error);
    return [];
  }
};

export const fetchOfferServer = async (id: string): Promise<Offer | null> => {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
    const response = await fetch(`${baseUrl}/offers/${id}`, {
      cache: 'no-store',
    });

    if (!response.ok) {
      return null;
    }

    const data: ApiResponse<OfferResponse> = await response.json();
    return data.data.offer;
  } catch (error) {
    console.error('Error fetching offer:', error);
    return null;
  }
};

export const fetchOfferReviewsServer = async (offerId: string): Promise<Review[]> => {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
    const response = await fetch(`${baseUrl}/offers/${offerId}/reviews`, {
      cache: 'no-store',
    });

    if (!response.ok) {
      return [];
    }

    const data: ApiResponse<ReviewsResponse> = await response.json();
    return data.data.reviews;
  } catch (error) {
    console.error('Error fetching reviews:', error);
    return [];
  }
};

