import { Card, CardContent, CardFooter } from "@/components/ui/card";

export default function ProductSkeleton() {
  return (
    <Card className="overflow-hidden">
      <div className="h-[200px] bg-gray-200 animate-pulse" />
      <CardContent className="p-4">
        <div className="h-4 w-3/4 bg-gray-200 animate-pulse rounded" />
        <div className="h-4 w-1/4 bg-gray-200 animate-pulse rounded mt-2" />
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <div className="h-8 w-full bg-gray-200 animate-pulse rounded" />
      </CardFooter>
    </Card>
  );
} 