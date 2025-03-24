import { PropertyCard, PropertyCardProps } from "./property-card";

export const PropertyGrid: React.FC<{ properties: PropertyCardProps[] }> = ({ properties }) => {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 md:gap-6">
        {properties.map((property , i) => (
          <PropertyCard key={i} {...property} />
        ))}
      </div>
    );
  };
  