import { VueQueryPlugin, QueryClient } from '@tanstack/vue-query'

/**
 * Shared QueryClient instance.
 * Import this in composables when you need to invalidate queries imperatively.
 */
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
})

export default {
  install(app) {
    app.use(VueQueryPlugin, { queryClient })
  },
}
