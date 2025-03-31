
import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const TipsAndTricksGuide: React.FC = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Sfaturi și Trucuri</CardTitle>
        <CardDescription>
          Recomandări pentru utilizarea eficientă a aplicației
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="border rounded-md p-4 space-y-3">
              <h3 className="font-medium text-lg">Optimizarea procesului de check-in</h3>
              <ul className="list-disc ml-6 space-y-2">
                <li>Organizează mai multe stații de check-in în zile cu participare ridicată</li>
                <li>Folosește funcția de previzualizare a etichetei pentru a verifica detaliile înainte de printare</li>
                <li>Pregătește din timp listele cu copiii obișnuiți pentru acces rapid</li>
                <li>Pentru copiii noi, completează toate detaliile cu atenție la prima vizită</li>
              </ul>
            </div>

            <div className="border rounded-md p-4 space-y-3">
              <h3 className="font-medium text-lg">Utilizarea statisticilor</h3>
              <ul className="list-disc ml-6 space-y-2">
                <li>Analizează tendințele de prezență pentru a planifica resurse și activități</li>
                <li>Identifică duminicile cu prezență ridicată pentru a pregăti stații suplimentare</li>
                <li>Urmărește proporția membri/vizitatori pentru a evalua eficiența programelor</li>
                <li>Folosește datele pentru raportări către conducerea bisericii</li>
              </ul>
            </div>
          </div>

          <div className="border rounded-md p-4 space-y-3">
            <h3 className="font-medium text-lg">Cele mai frecvente probleme și soluții</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-medium">Problema: Căutarea nu returnează rezultate</h4>
                <ul className="list-disc ml-6 mt-2 space-y-1">
                  <li>Verifică ortografia numelui</li>
                  <li>Încearcă să cauți doar după prenume</li>
                  <li>Verifică dacă copilul este deja înregistrat în sistem</li>
                </ul>
              </div>

              <div>
                <h4 className="font-medium">Problema: Etichetele nu se printează</h4>
                <ul className="list-disc ml-6 mt-2 space-y-1">
                  <li>Verifică conexiunea la imprimantă</li>
                  <li>Resetează imprimanta</li>
                  <li>Verifică setările de imprimare</li>
                  <li>Folosește etichete scrise manual ca alternativă temporară</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TipsAndTricksGuide;
