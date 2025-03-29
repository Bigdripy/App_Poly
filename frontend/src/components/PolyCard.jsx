import React, { useState } from "react";
import { Card, Tag, Button, Space, message, Modal, Descriptions } from "antd";
import { FilePdfOutlined } from "@ant-design/icons";
import axios from "axios";

const PolyCard = ({ poly, id, onStatusUpdate }) => {
  const [isModalVisible, setIsModalVisible] = useState(false);

  if (!Array.isArray(poly) || poly.length < 14) {
    return <Card style={{ width: 320, textAlign: "center" }}>Données manquantes...</Card>;
  }

  // 🛠 Convertit l'array en objet avec des clés compréhensibles
  const polyObj = {
    horodateur: poly[0],
    identifiant: poly[1] || "N/A",
    filieres: poly[2] || "Non renseigné",
    document_name: poly[3] || "Non renseigné",
    enseignant: poly[4] || "Non renseigné",
    mail: poly[5] || "Non renseigné",
    begin_course: poly[6] || "Non renseigné",
    reusable: poly[7] || "Non renseigné",
    chamilo_link: poly[8] || null,
    semestre: poly[9] || "Non renseigné",
    partie_number: poly[10] || "Non renseigné",
    other_info: poly[11] || "Aucune",
    num_copies: poly[12] || "Non renseigné",
    statut: poly[13] || "En attente",
  };

  console.log("✅ PolyCard - Objet structuré :", polyObj);

  const updateStatus = async () => {
    try {
      await axios.put(`http://localhost:3001/polys/${id}`, { statut: "Imprimé" });
      message.success("Statut mis à jour !");
      onStatusUpdate();
    } catch (error) {
      message.error("Erreur de mise à jour");
    }
  };

  return (
    <>
      <Card
        title={`📌 ID: ${polyObj.identifiant}`}
        extra={<Tag color={polyObj.statut === "Imprimé" ? "green" : "orange"}>{polyObj.statut}</Tag>}
        style={{ width: 320, cursor: "pointer" }}
        onClick={() => setIsModalVisible(true)}
      >
        <p><strong>📚 Cours :</strong> {polyObj.document_name}</p>
        <p><strong>🎓 Filière :</strong> {polyObj.filieres}</p>
        <p><strong>📅 Début :</strong> {polyObj.begin_course}</p>

        <Space direction="vertical">
          {polyObj.chamilo_link && (
            <a href={polyObj.chamilo_link} target="_blank" rel="noopener noreferrer">
              <Button icon={<FilePdfOutlined />} type="link">Voir le PDF</Button>
            </a>
          )}
          {polyObj.statut !== "Imprimé" && (
            <Button type="primary" onClick={(e) => { e.stopPropagation(); updateStatus(); }}>
              Marquer comme imprimé
            </Button>
          )}
        </Space>
      </Card>

      {/* 📋 Détails en modal */}
      <Modal
        title="📄 Détails du Poly"
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={[<Button key="close" onClick={() => setIsModalVisible(false)}>Fermer</Button>]}
      >
        <Descriptions bordered column={1} size="middle">
          <Descriptions.Item label="📌 Identifiant">{polyObj.identifiant}</Descriptions.Item>
          <Descriptions.Item label="📚 Cours">{polyObj.document_name}</Descriptions.Item>
          <Descriptions.Item label="🎓 Filière">{polyObj.filieres}</Descriptions.Item>
          <Descriptions.Item label="📅 Début">{polyObj.begin_course}</Descriptions.Item>
          <Descriptions.Item label="👨‍🏫 Enseignant">{polyObj.enseignant}</Descriptions.Item>
          <Descriptions.Item label="✉️ Email">{polyObj.mail}</Descriptions.Item>
          <Descriptions.Item label="📁 Lien Chamilo">
            {polyObj.chamilo_link ? (
              <a href={polyObj.chamilo_link} target="_blank" rel="noopener noreferrer">{polyObj.chamilo_link}</a>
            ) : ("Non fourni")}
          </Descriptions.Item>
          <Descriptions.Item label="📑 Partie">{polyObj.partie_number}</Descriptions.Item>
          <Descriptions.Item label="🖨️ Copies">{polyObj.num_copies}</Descriptions.Item>
          <Descriptions.Item label="ℹ️ Autres infos">{polyObj.other_info}</Descriptions.Item>
        </Descriptions>
      </Modal>
    </>
  );
};

export default PolyCard;
