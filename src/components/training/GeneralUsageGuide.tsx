
import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const GeneralUsageGuide: React.FC = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Despre aplicația Vertical Kids Check-In</CardTitle>
        <CardDescription>
          Familiarizează-te cu interfața și funcționalitățile principale ale aplicației
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Funcționalități principale</h3>
            <ul className="list-disc ml-6 space-y-3">
              <li>
                <span className="font-medium">Dashboard & Analize:</span> Vizualizează statistici despre prezență și tendințe de participare
              </li>
              <li>
                <span className="font-medium">Check-in & Etichete:</span> Înregistrează prezența copiilor și generează etichete
              </li>
              <li>
                <span className="font-medium">Prezență Duminicală:</span> Vizualizează și gestionează prezența pe duminici
              </li>
              <li>
                <span className="font-medium">Centralizator Membri:</span> Gestionează baza de date a copiilor
              </li>
              <li>
                <span className="font-medium">Setări:</span> Configurează aplicația conform nevoilor tale
              </li>
            </ul>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Cum să începi</h3>
            <ol className="list-decimal ml-6 space-y-3">
              <li>Familiarizează-te cu interfața navigând prin diferitele secțiuni</li>
              <li>Verifică pagina Centralizator Membri pentru a vedea copiii înregistrați</li>
              <li>Practică procesul de check-in cu câțiva copii de test</li>
              <li>Consultă statisticile din Dashboard pentru a înțelege tendințele</li>
              <li>Personalizează setările aplicației conform nevoilor bisericii tale</li>
            </ol>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default GeneralUsageGuide;
