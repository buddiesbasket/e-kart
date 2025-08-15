import { Request, Response } from 'express';
import axios, { AxiosRequestConfig } from 'axios';

export const getProducts = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const {
      limit = '10',
      skip = '0',
      search,
      ...rest
    } = req.query as {
      limit?: string;
      skip?: string;
      search?: string;
      [key: string]: string | undefined;
    };

    // Always send pagination params
    const params: Record<string, string | number> = {
      limit: Number(limit),
      skip: Number(skip),
    };

    // Add extra filters (category, sortBy, etc.)
    for (const key in rest) {
      if (rest[key] !== undefined) {
        params[key] = rest[key] as string;
      }
    }

    // Use search or all products endpoint
    const url = search
      ? `https://dummyjson.com/products/search?q=${encodeURIComponent(search)}`
      : `https://dummyjson.com/products`;

    // Fetch from DummyJSON with pagination
    const { data } = await axios.get(url, { params });

    console.log('backend data', data)

    res.json({
      success: true,
      products: data.products || [],
      total: data.total || 0,
      skip: data.skip || Number(skip),
      limit: data.limit || Number(limit),
    });
  } catch (error) {
    console.error('Error fetching products:', (error as Error).message);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch products',
    });
  }
};

export const getProductById = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const { data } = await axios.get(`https://dummyjson.com/products/${id}`);

    res.json({
      success: true,
      product: data,
    });
  } catch (error) {
    console.error('Error fetching product:', (error as Error).message);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch product',
    });
  }
};
