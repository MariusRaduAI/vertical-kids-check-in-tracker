
import React, { useState } from "react";
import PageHeader from "@/components/common/PageHeader";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { User } from "@/types/models";
import { useToast } from "@/hooks/use-toast";
import { mockUsers } from "@/data/mockData";

const SettingsPage: React.FC = () => {
  const { toast } = useToast();
  const [appSettings, setAppSettings] = useState({
    appName: "Școala Duminicală",
    language: "ro",
    notifications: true,
    automaticAbsenceMarking: true,
    printFormat: "pdf",
  });
  
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    role: "Voluntar",
  });
  
  // Handle settings change
  const handleSettingChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setAppSettings(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // Handle toggle settings
  const handleToggleChange = (name: string, value: boolean) => {
    setAppSettings(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // Handle saving settings
  const handleSaveSettings = () => {
    toast({
      title: "Setări salvate",
      description: "Setările au fost actualizate cu succes."
    });
  };
  
  // Handle new user input
  const handleNewUserChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setNewUser(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // Handle adding new user
  const handleAddUser = () => {
    if (!newUser.name || !newUser.email) {
      toast({
        title: "Eroare",
        description: "Numele și email-ul sunt obligatorii.",
        variant: "destructive"
      });
      return;
    }
    
    const newUserEntry: User = {
      id: `user-${users.length + 1}`,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role as "Admin" | "Voluntar",
      createdAt: new Date().toISOString().split("T")[0]
    };
    
    setUsers(prev => [...prev, newUserEntry]);
    setNewUser({
      name: "",
      email: "",
      role: "Voluntar"
    });
    
    toast({
      title: "Utilizator adăugat",
      description: `${newUser.name} a fost adăugat ca ${newUser.role}.`
    });
  };
  
  // Handle deleting user
  const handleDeleteUser = (userId: string) => {
    setUsers(prev => prev.filter(user => user.id !== userId));
    
    toast({
      title: "Utilizator șters",
      description: "Utilizatorul a fost eliminat cu succes."
    });
  };

  return (
    <div className="animate-fade-in">
      <PageHeader
        title="Setări"
        description="Configurează aplicația și gestionează utilizatorii"
      />
      
      <Tabs defaultValue="general">
        <TabsList className="mb-6">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="users">Utilizatori</TabsTrigger>
          <TabsTrigger value="backup">Backup</TabsTrigger>
        </TabsList>
        
        <TabsContent value="general">
          <Card>
            <CardHeader>
              <CardTitle>Setări Generale</CardTitle>
              <CardDescription>
                Configurează setările generale ale aplicației
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="appName">Numele Aplicației</Label>
                <Input
                  id="appName"
                  name="appName"
                  value={appSettings.appName}
                  onChange={handleSettingChange}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="language">Limba</Label>
                <Select
                  name="language"
                  value={appSettings.language}
                  onValueChange={(value) => 
                    setAppSettings(prev => ({ ...prev, language: value }))
                  }
                >
                  <SelectTrigger id="language">
                    <SelectValue placeholder="Selectează limba" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ro">Română</SelectItem>
                    <SelectItem value="en">Engleză</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="notifications">Notificări</Label>
                  <p className="text-sm text-muted-foreground">
                    Primește notificări despre prezență
                  </p>
                </div>
                <Switch
                  id="notifications"
                  checked={appSettings.notifications}
                  onCheckedChange={(value) => 
                    handleToggleChange("notifications", value)
                  }
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="automaticAbsenceMarking">Marcare Automată Absențe</Label>
                  <p className="text-sm text-muted-foreground">
                    Marchează automat absențele la sfârșitul zilei
                  </p>
                </div>
                <Switch
                  id="automaticAbsenceMarking"
                  checked={appSettings.automaticAbsenceMarking}
                  onCheckedChange={(value) => 
                    handleToggleChange("automaticAbsenceMarking", value)
                  }
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="printFormat">Format Etichetă</Label>
                <Select
                  name="printFormat"
                  value={appSettings.printFormat}
                  onValueChange={(value) => 
                    setAppSettings(prev => ({ ...prev, printFormat: value }))
                  }
                >
                  <SelectTrigger id="printFormat">
                    <SelectValue placeholder="Selectează formatul" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pdf">PDF</SelectItem>
                    <SelectItem value="png">PNG</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleSaveSettings}>Salvează Setările</Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="users">
          <Card>
            <CardHeader>
              <CardTitle>Gestionare Utilizatori</CardTitle>
              <CardDescription>
                Adaugă sau modifică utilizatorii cu acces la aplicație
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Utilizatori Existenți</h3>
                <div className="border rounded-md divide-y">
                  {users.map(user => (
                    <div 
                      key={user.id} 
                      className="p-4 flex items-center justify-between"
                    >
                      <div>
                        <div className="font-medium">{user.name}</div>
                        <div className="text-sm text-muted-foreground">{user.email}</div>
                        <div className="text-xs mt-1">
                          <span className="bg-primary-100 text-primary-800 px-2 py-0.5 rounded-full">
                            {user.role}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm">Editează</Button>
                        <Button 
                          variant="destructive" 
                          size="sm"
                          onClick={() => handleDeleteUser(user.id)}
                          disabled={user.role === "Admin" && users.filter(u => u.role === "Admin").length === 1}
                        >
                          Șterge
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="space-y-4 border-t pt-4">
                <h3 className="text-lg font-medium">Adaugă Utilizator Nou</h3>
                <div className="grid gap-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Nume Complet</Label>
                      <Input
                        id="name"
                        name="name"
                        value={newUser.name}
                        onChange={handleNewUserChange}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={newUser.email}
                        onChange={handleNewUserChange}
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="role">Rol</Label>
                    <Select
                      name="role"
                      value={newUser.role}
                      onValueChange={(value) => 
                        setNewUser(prev => ({ ...prev, role: value }))
                      }
                    >
                      <SelectTrigger id="role">
                        <SelectValue placeholder="Selectează rolul" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Admin">Admin</SelectItem>
                        <SelectItem value="Voluntar">Voluntar</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <Button onClick={handleAddUser}>Adaugă Utilizator</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="backup">
          <Card>
            <CardHeader>
              <CardTitle>Backup & Export</CardTitle>
              <CardDescription>
                Creează backup-uri și exportă date
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Backup Date</h3>
                <p className="text-muted-foreground">
                  Creează o copie de rezervă a tuturor datelor aplicației
                </p>
                <Button>Creează Backup</Button>
              </div>
              
              <div className="space-y-4 border-t pt-4">
                <h3 className="text-lg font-medium">Export Date</h3>
                <p className="text-muted-foreground">
                  Exportă datele în format CSV
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Button variant="outline">Export Membri</Button>
                  <Button variant="outline">Export Prezență</Button>
                  <Button variant="outline">Export Toate Datele</Button>
                </div>
              </div>
              
              <div className="space-y-4 border-t pt-4">
                <h3 className="text-lg font-medium">Import Date</h3>
                <p className="text-muted-foreground">
                  Importă date din CSV (doar format compatibil)
                </p>
                <div className="flex items-center gap-4">
                  <Input type="file" />
                  <Button variant="outline">Import</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SettingsPage;
