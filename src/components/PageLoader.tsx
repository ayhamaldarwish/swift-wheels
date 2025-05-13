import { Skeleton } from "@/components/ui/skeleton";

/**
 * PageLoader component
 * 
 * Displays a skeleton loading state for pages while they are being loaded
 */
const PageLoader = () => (
  <div className="flex flex-col min-h-screen bg-gray-50 p-4">
    <div className="h-16 w-full mb-8">
      <Skeleton className="h-full w-full" />
    </div>
    <div className="flex-1 space-y-8 max-w-6xl mx-auto w-full">
      <Skeleton className="h-64 w-full rounded-xl" />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <Skeleton key={i} className="h-64 w-full rounded-lg" />
        ))}
      </div>
    </div>
  </div>
);

export default PageLoader;
