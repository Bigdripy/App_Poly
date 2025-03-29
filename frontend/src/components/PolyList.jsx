import React, { useEffect, useState } from "react";
import { List, message } from "antd";
import axios from "axios";
import PolyCard from "./PolyCard";

const PolyList = () => {
  const [polys, setPolys] = useState({
    "En attente": [],
    "Validé": [],
    "Refusé": [],
    "Imprimé": []
  });

  useEffect(() => {
    const fetchPolys = async () => {
      try {
        const response = await axios.get("http://localhost:3001/polys");
        console.log("📥 Données reçues depuis l'API :", response.data);
        
        // Regrouper les polys par statut
        const polysByStatus = {
          "Reçu du distributeur": [],
          "Validé": [],
          "Refusé": [],
          "Imprimé": []
        };

        // Assurez-vous que chaque poly a bien un statut défini
        response.data.reverse().forEach(poly => {  
          const statut = poly[13]; // Supposons que le statut est à l'index 1
          if (polysByStatus[statut]) {
            polysByStatus[statut].push(poly);
          }
        });

        setPolys(polysByStatus);  
      } catch (error) {
        message.error("Erreur de récupération des polycopiés.");
      }
    };

    fetchPolys();
  }, []);

  const refreshList = () => {
    message.loading("Mise à jour...");
    setTimeout(() => {
      window.location.reload();
    }, 1000);
  };

  return (
    <div>
      {Object.keys(polys).map(status => (
        <div key={status}>
          <h2>{status}</h2> {/* Titre de la section */}
          <List
            grid={{ gutter: 16, column: 3 }}
            dataSource={polys[status]}
            renderItem={(poly, index) => (
              <List.Item>
                <PolyCard poly={poly} id={index} onStatusUpdate={refreshList} />
              </List.Item>
            )}
          />
        </div>
      ))}
    </div>
  );
};

export default PolyList;
