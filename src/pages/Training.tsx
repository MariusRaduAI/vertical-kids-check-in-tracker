import React from "react";
import PageHeader from "@/components/common/PageHeader";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { BookOpen, Tag, HelpCircle, Lightbulb, School } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Training: React.FC = () => {
  return (
    <div className="animate-fade-in space-y-6">
      <PageHeader
        title="Training & Onboarding"
        description="Învață cum să folosești aplicația Vertical Kids Check-In"
      />

      <Tabs defaultValue="checkin" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="checkin" className="flex items-center gap-2">
            <Tag className="h-4 w-4" />
            <span>Check-in & Etichete</span>
          </TabsTrigger>
          <TabsTrigger value="general" className="flex items-center gap-2">
            <School className="h-4 w-4" />
            <span>Utilizare Generală</span>
          </TabsTrigger>
          <TabsTrigger value="tips" className="flex items-center gap-2">
            <Lightbulb className="h-4 w-4" />
            <span>Sfaturi & Trucuri</span>
          </TabsTrigger>
        </TabsList>

        {/* Check-in & Tags Section */}
        <TabsContent value="checkin" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-primary" />
                Ghid de Check-in și Generare Etichete
              </CardTitle>
              <CardDescription>
                Învață cum să înregistrezi prezența copiilor și să generezi etichete
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Pașii procesului de check-in</h3>
                  <ol className="list-decimal ml-6 space-y-3">
                    <li>
                      <span className="font-medium">Caută copilul:</span> Introdu numele copilului în câmpul de căutare. Poți căuta după prenume, nume de familie sau numele complet.
                    </li>
                    <li>
                      <span className="font-medium">Selectează copilul:</span> Din rezultatele căutării, selectează copilul corect. Dacă este un copil nou, folosește opțiunea "Este copil nou?".
                    </li>
                    <li>
                      <span className="font-medium">Alege programul:</span> Selectează programul (P1 sau P2) la care participă copilul.
                    </li>
                    <li>
                      <span className="font-medium">Completează verificarea medicală:</span> Confirmă că ai verificat starea generală a copilului, temperatura și absența simptomelor.
                    </li>
                    <li>
                      <span className="font-medium">Generează eticheta:</span> Apasă butonul "Generează Etichetă" pentru a crea codul unic pentru copil.
                    </li>
                    <li>
                      <span className="font-medium">Printează etichetele:</span> Selectează numărul de etichete dorit și printează-le pentru copil și părinte.
                    </li>
                  </ol>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Înregistrarea unui copil nou</h3>
                  <div className="space-y-3">
                    <p>Când un copil vine pentru prima dată:</p>
                    <ol className="list-decimal ml-6 space-y-3">
                      <li>Introdu numele în câmpul de căutare</li>
                      <li>Când copilul nu este găsit, apasă pe "Este copil nou?"</li>
                      <li>Completează formularul cu prenume, nume și grupa de vârstă</li>
                      <li>Apasă "Adaugă Copil" pentru a-l înregistra în sistem</li>
                      <li>Continuă cu procesul normal de check-in</li>
                    </ol>
                    <div className="mt-4">
                      <Button asChild className="mt-2">
                        <Link to="/checkin">
                          Mergi la pagina de Check-in
                        </Link>
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="border-t pt-6">
                <h3 className="text-lg font-semibold mb-4">Întrebări frecvente despre etichete</h3>
                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="item-1">
                    <AccordionTrigger>
                      Ce informații conține o etichetă?
                    </AccordionTrigger>
                    <AccordionContent>
                      <p>Fiecare etichetă conține:</p>
                      <ul className="list-disc ml-6 mt-2 space-y-1">
                        <li>Numele complet al copilului</li>
                        <li>Un cod unic de identificare</li>
                        <li>Grupa de vârstă</li>
                        <li>Programul (P1 sau P2)</li>
                        <li>Data participării</li>
                      </ul>
                      <p className="mt-2">Aceste informații sunt esențiale pentru identificarea copilului și pentru asigurarea că fiecare copil este preluat de părintele corect la sfârșitul programului.</p>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="item-2">
                    <AccordionTrigger>
                      Câte etichete trebuie să printez?
                    </AccordionTrigger>
                    <AccordionContent>
                      <p>Recomandam 3 etichete pentru fiecare copil:</p>
                      <ol className="list-decimal ml-6 mt-2 space-y-1">
                        <li><span className="font-medium">Pentru copil</span> - se aplică pe spatele copilului</li>
                        <li><span className="font-medium">Pentru părinte</span> - pentru identificare la preluare</li>
                        <li><span className="font-medium">Pentru materialele copilului</span> - geantă, haine etc.</li>
                      </ol>
                      <p className="mt-2">Poți ajusta numărul de etichete în funcție de necesități (1-5 etichete).</p>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="item-3">
                    <AccordionTrigger>
                      Ce fac dacă imprimanta nu funcționează?
                    </AccordionTrigger>
                    <AccordionContent>
                      <p>În cazul în care imprimanta nu funcționează:</p>
                      <ol className="list-decimal ml-6 mt-2 space-y-1">
                        <li>Poți completa manual etichete de rezervă folosind codul unic afișat pe ecran</li>
                        <li>Notează codul unic și în registrul de prezență fizic</li>
                        <li>Verifică conectivitatea imprimantei și încearcă din nou</li>
                        <li>Contactează responsabilul tehnic dacă problema persistă</li>
                      </ol>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="item-4">
                    <AccordionTrigger>
                      Cum procedez cu verificarea medicală?
                    </AccordionTrigger>
                    <AccordionContent>
                      <p>Verificarea medicală este obligatorie și include:</p>
                      <ul className="list-disc ml-6 mt-2 space-y-1">
                        <li>Verificarea temperaturii (se poate face cu termometru digital fără contact)</li>
                        <li>Observarea vizuală a stării generale a copilului</li>
                        <li>Întrebarea părintelui despre posibile simptome (tuse, febră, etc.)</li>
                      </ul>
                      <p className="mt-2">Nu trebuie să notezi temperatura exactă, doar să confirmi că ai efectuat verificarea și că copilul este apt să participe la program.</p>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <HelpCircle className="h-5 w-5 text-primary" />
                Video Tutorial
              </CardTitle>
              <CardDescription>
                Privește acest videoclip demonstrativ pentru procesul de check-in
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="aspect-video bg-muted rounded-md flex items-center justify-center">
                <div className="text-center p-6">
                  <p className="text-muted-foreground mb-4">
                    Aici va fi încorporat un videoclip tutorial când va fi disponibil.
                  </p>
                  <Button variant="outline">
                    În curând disponibil
                  </Button>
                </div>
              </div>
              <p className="text-sm text-muted-foreground mt-4">
                Tutorialele video sunt în curs de realizare și vor fi disponibile în curând. Acestea vor acoperi întregul proces de la înregistrarea unui copil nou până la generarea etichetelor.
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        {/* General Usage Section */}
        <TabsContent value="general" className="space-y-6">
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
        </TabsContent>

        {/* Tips & Tricks Section */}
        <TabsContent value="tips" className="space-y-6">
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
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Training;
