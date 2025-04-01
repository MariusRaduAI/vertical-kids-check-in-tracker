
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const Index = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center max-w-2xl px-4">
        <img 
          src="/lovable-uploads/41d4c4ca-017a-4fe0-a4d3-cfc69e2998cc.png" 
          alt="Vertical Kids Logo" 
          className="h-16 mx-auto mb-6" 
        />
        <h1 className="text-4xl font-bold mb-4">Check-In Tracker</h1>
        <p className="text-xl text-gray-600 mb-8">
          Gestionați prezența copiilor în programele Vertical Kids cu ușurință.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild size="lg">
            <Link to="/checkin">
              Începe Check-In
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link to="/dashboard">
              Vezi Dashboard
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Index;
