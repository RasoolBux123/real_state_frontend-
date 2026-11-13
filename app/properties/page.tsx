import { Suspense } from "react";
import PropertiesView from "./PropertiesView";

export const metadata = { title: "Properties | Real Estate" };

export default function PropertiesPage() {
  return (
    <Suspense fallback={<p className="py-20 text-center text-gray-500">Loading...</p>}>
      <PropertiesView />
    </Suspense>
  );
}
