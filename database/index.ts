import type { Trip, Day, Item, Attachment } from "~/types";

// API 基础 URL
const API_BASE = "/api/trips";

// 通用 API 请求函数
async function apiRequest<T>(
  url: string,
  options: RequestInit = {}
): Promise<T> {
  const response = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
    ...options,
  });

  if (!response.ok) {
    const error = await response
      .json()
      .catch(() => ({ message: "Unknown error" }));
    const errorMessage = error.message || `HTTP ${response.status}`;
    console.error(`API Error: ${errorMessage}`, {
      url,
      status: response.status,
    });
    throw new Error(errorMessage);
  }

  return response.json();
}

// 数据库工具函数
export const tripDb = {
  // 获取所有行程
  async getAllTrips(): Promise<Trip[]> {
    return apiRequest<Trip[]>(API_BASE);
  },

  // 根据状态获取行程
  async getTripsByStatus(status: string): Promise<Trip[]> {
    const trips = await this.getAllTrips();
    const now = new Date();
    const today = now.toISOString().split("T")[0];

    if (!today) {
      return [];
    }

    return trips.filter((trip) => {
      switch (status) {
        case "ongoing":
          return trip.startAt <= today && trip.endAt >= today;
        case "upcoming":
          return trip.startAt > today;
        case "completed":
          return trip.endAt < today;
        default:
          return true;
      }
    });
  },

  // 获取单个行程
  async getTrip(id: string): Promise<Trip | undefined> {
    try {
      return await apiRequest<Trip>(`${API_BASE}/${id}`);
    } catch (error) {
      if (
        error instanceof Error &&
        (error.message.includes("404") ||
          error.message.includes("Trip not found"))
      ) {
        console.warn(`Trip not found: ${id}`);
        return undefined;
      }
      console.error(`Failed to get trip ${id}:`, error);
      throw error;
    }
  },

  // 创建行程
  async createTrip(
    trip: Omit<Trip, "id" | "createdAt" | "updatedAt">
  ): Promise<string> {
    const result = await apiRequest<{ id: string }>(API_BASE, {
      method: "POST",
      body: JSON.stringify(trip),
    });
    return result.id;
  },

  // 更新行程
  async updateTrip(id: string, updates: Partial<Trip>): Promise<void> {
    await apiRequest(`${API_BASE}/${id}`, {
      method: "PUT",
      body: JSON.stringify(updates),
    });
  },

  // 软删除行程
  async deleteTrip(id: string): Promise<void> {
    await apiRequest(`${API_BASE}/${id}`, {
      method: "DELETE",
    });
  },

  // 搜索行程
  async searchTrips(keyword: string): Promise<Trip[]> {
    return apiRequest<Trip[]>(
      `${API_BASE}/search?keyword=${encodeURIComponent(keyword)}`
    );
  },
};
