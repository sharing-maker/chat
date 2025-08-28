import { usePathname } from "next/navigation";
export function LoginLayoutSkeleton() {
  return (
    <div className="flex w-full min-h-screen bg-gray-50">
      <div className="hidden md:flex w-2/3 items-center justify-center bg-gray-100">
        <div className="w-56 h-56 bg-gray-200 rounded-full animate-pulse" />
      </div>
      <div className="flex w-full md:w-1/3 items-center justify-center">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-16 border border-gray-200">
          <div className="h-10 bg-gray-200 rounded mb-8 animate-pulse" />
          <div className="h-14 bg-gray-200 rounded mb-6 animate-pulse" />
          <div className="h-14 bg-gray-200 rounded mb-6 animate-pulse" />
          <div className="h-14 bg-gray-200 rounded mb-6 animate-pulse" />
        </div>
      </div>
    </div>
  );
}
interface SidebarSkeletonProps {
  className?: string;
}

export function SidebarSkeleton({ className = "" }: SidebarSkeletonProps) {
  return (
    <div
      className={`w-64 bg-gray-900 text-white min-h-screen flex-shrink-0 flex flex-col ${className}`}
    >
      <div className="p-4 border-b border-gray-700">
        <div className="h-6 bg-gray-700 rounded animate-pulse"></div>
      </div>

      <div className="flex-1 p-4 space-y-3">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="h-4 bg-gray-700 rounded animate-pulse"></div>
        ))}
      </div>

      {/* User profile at bottom */}
      <div className="p-4 border-t border-gray-700 mt-auto">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gray-700 rounded-full animate-pulse"></div>
          <div className="flex-1 space-y-2">
            <div className="h-3 bg-gray-700 rounded animate-pulse"></div>
            <div className="h-2 bg-gray-700 rounded animate-pulse w-3/4"></div>
          </div>
        </div>
      </div>
    </div>
  );
}

interface ContentSkeletonProps {
  className?: string;
}

export function ContentSkeleton({ className = "" }: ContentSkeletonProps) {
  return (
    <div className={`flex-1 bg-white ${className}`}>
      <div className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded"></div>
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          <div className="h-4 bg-gray-200 rounded w-5/6"></div>

          {/* Card grid for content areas */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-8">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="border border-gray-200 rounded-lg p-4">
                <div className="h-4 bg-gray-200 rounded mb-2 animate-pulse"></div>
                <div className="h-3 bg-gray-200 rounded w-2/3 animate-pulse"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

interface MainLayoutSkeletonProps {
  showSidebar?: boolean;
  className?: string;
}

export function MainLayoutSkeleton({
  showSidebar = true,
  className = "",
}: MainLayoutSkeletonProps) {
  const pathname = usePathname();
  if (pathname === "/login") {
    return <LoginLayoutSkeleton />;
  }
  return (
    <div className={`flex min-h-screen bg-white ${className}`}>
      {showSidebar && <SidebarSkeleton />}
      <ContentSkeleton />
    </div>
  );
}

export default {
  SidebarSkeleton,
  ContentSkeleton,
  MainLayoutSkeleton,
  LoginLayoutSkeleton,
};
