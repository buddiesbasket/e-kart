import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class UtilService {
  getStars(rating: number): { type: 'full' | 'half' | 'empty' }[] {
    const stars: { type: 'full' | 'half' | 'empty' }[] = [];
    const fullStars = Math.floor(rating);
    const hasHalf = rating % 1 >= 0.5;

    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push({ type: 'full' });
      } else if (i === fullStars && hasHalf) {
        stars.push({ type: 'half' });
      } else {
        stars.push({ type: 'empty' });
      }
    }

    return stars;
  }

  // Using high-quality free images from Pexels/Unsplash
  featuredCategories = [
    {
      id: 'smartphones',
      name: 'Smartphones',
      image:
        'https://images.unsplash.com/photo-1609692814858-f7cd2f0afa4f?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      count: 20,
    },
    {
      id: 'laptops',
      name: 'Laptops',
      image:
        'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800&auto=format&fit=crop',
      count: 15,
    },
    {
      id: 'fragrances',
      name: 'Fragrances',
      image:
        'https://images.pexels.com/photos/3989821/pexels-photo-3989821.jpeg?auto=compress&cs=tinysrgb&w=800',
      count: 12,
    },
  ];

  customerReviews = [
    {
      name: 'Alex Johnson',
      avatar:
        'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=800',
      rating: 5,
      comment:
        'Amazing products and fast delivery! Will definitely shop here again.',
      date: '2023-05-15',
    },
    {
      name: 'Sarah Miller',
      avatar:
        'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=800',
      rating: 4,
      comment:
        'Great customer service. The product quality exceeded my expectations.',
      date: '2023-06-02',
    },
    {
      name: 'Michael Chen',
      avatar:
        'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=800',
      rating: 5,
      comment: 'Best prices I found online. Packaging was eco-friendly too!',
      date: '2023-06-18',
    },
  ];

  brands = [
    {
      name: 'Apple',
      logo: 'https://1000logos.net/wp-content/uploads/2016/10/Apple-Logo-768x432.png',
    },
    {
      name: 'Samsung',
      logo: 'https://1000logos.net/wp-content/uploads/2017/06/Samsung-Logo-2-500x281.png',
    },
    {
      name: 'Lg',
      logo: 'https://1000logos.net/wp-content/uploads/2017/03/LG-Logo-768x432.png',
    },
    {
      name: 'Nike',
      logo: 'https://1000logos.net/wp-content/uploads/2021/11/Nike-Logo-768x432.png',
    },
    {
      name: 'Adidas',
      logo: 'https://1000logos.net/wp-content/uploads/2025/08/Adidas-Originals-Logo-768x432.png',
    },
    {
      name: 'OnePlus',
      logo: 'https://1000logos.net/wp-content/uploads/2022/11/OnePlus-Logo-768x432.png',
    },
  ];

  heroImage =
    'https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?w=1600&auto=format&fit=crop';

  getHighQualityProductImage(category: string): string {
    const images: Record<string, string> = {
      smartphones:
        'https://images.unsplash.com/photo-1616410011236-7a42121dd981?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8aXBob25lfGVufDB8fDB8fHww',
      laptops:
        'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=800&auto=format&fit=crop',
      fragrances:
        'https://images.pexels.com/photos/3989821/pexels-photo-3989821.jpeg?auto=compress&cs=tinysrgb&w=800',
      skincare:
        'https://images.pexels.com/photos/4041392/pexels-photo-4041392.jpeg?auto=compress&cs=tinysrgb&w=800',
      groceries:
        'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=800&auto=format&fit=crop',
      default:
        'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop',
    };

    return images[category.toLowerCase()] || images['default'];
  }

  trendingNow = [
    {
      id: '1',
      title: 'Essence Mascara Lash Princess',
      brand: 'Essence',
      image:
        'https://m.media-amazon.com/images/I/61HLmRuVZvL._UF1000,1000_QL80_.jpg',
      price: 9.99,
      rating: 4.17,
      discountPercentage: 15,
    },
    {
      id: '2',
      title: 'Eyeshadow Palette with Mirror',
      brand: 'Glamour Beauty',
      image:
        'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=800&auto=format&fit=crop',
      price: 19.99,
      rating: 4.35,
      discountPercentage: 15,
    },
    {
      id: '3',
      title: 'Powder Canister',
      brand: 'Velvet Touch',
      image:
        'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop',
      price: 14.99,
      rating: 4.52,
      discountPercentage: 15,
    },
    {
      id: '4',
      title: 'Red Lipstick',
      brand: 'Chic Cosmetics',
      image:
        'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=800&auto=format&fit=crop',
      price: 12.99,
      rating: 4.79,
      discountPercentage: 15,
    },
  ];
}
