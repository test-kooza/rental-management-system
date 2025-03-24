"use client"
import { useInfiniteQuery } from "@tanstack/react-query";
import { useCallback, useEffect, useMemo } from "react";
import { useInView } from "react-intersection-observer";
import { getProperties, PropertyQueryParams } from "@/actions/home-property";

export type UsePropertiesParams = Omit<PropertyQueryParams, 'limit' | 'offset'>;

export const useProperties = (params: UsePropertiesParams = {}, initialLimit = 8) => {
  const { ref, inView } = useInView({
    threshold: 0.1,
    triggerOnce: false,
  });

  const queryParams = useMemo(() => ({
    ...params,
    limit: initialLimit,
  }), [params, initialLimit]);

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status,
    error,
    refetch,
  } = useInfiniteQuery({
    queryKey: ['properties', queryParams],
    queryFn: async ({ pageParam = 0 }) => {
      return getProperties({
        ...queryParams,
        offset: pageParam,
      });
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage, _, lastPageParam) => {
      return lastPage.hasMore ? lastPageParam + lastPage.properties.length : undefined;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Flatten the pages into a single array of properties
  const properties = useMemo(() => 
    data?.pages.flatMap(page => page.properties) || [],
  [data?.pages]);

  const totalCount = useMemo(() => 
    data?.pages[0]?.totalCount || 0,
  [data?.pages]);

  useEffect(() => {
    if (inView && !isFetchingNextPage && hasNextPage) {
      fetchNextPage();
    }
  }, [inView, isFetchingNextPage, fetchNextPage, hasNextPage]);

  const loadMoreRef = useCallback((node: any) => {
    ref(node);
  }, [ref]);

  return {
    properties,
    totalCount,
    isLoading: status === 'pending',
    isError: status === 'error',
    error,
    hasNextPage,
    isFetchingNextPage,
    loadMoreRef,
    refetch,
  };
};