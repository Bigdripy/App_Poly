import React, { useState } from "react";
import { Form, Input, Button, DatePicker, Checkbox, Select, message } from "antd";
import axios from "axios";
import { useNavigate } from "react-router-dom"; // 🔥 Importer useNavigate

const { Option } = Select;

const PolyForm = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate(); // 🔥 Hook pour redirection

  const onFinish = async (values) => {
    setLoading(true);
    
    const formData = {
      horodateur: new Date().toLocaleDateString("fr-FR"),
      identifiant: Math.random().toString(36).substring(7),
      filieres: values.filieres,
      document_name: values.document_name,
      enseignant: values.enseignant,
      mail: values.mail,
      begin_course: values.begin_course.format("DD/MM/YYYY"),
      reusable: values.reusable ? "OUI" : "NON",
      chamilo_link: values.chamilo_link,
      semestre: values.semestre,
      partie_number: values.partie_number,
      other_info: values.other_info,
      num_copies: values.num_copies,
    };

    console.log("📤 Données envoyées au backend :", formData);

    try {
      const response = await axios.post("http://localhost:3001/polys", formData);
      console.log("✅ Réponse du serveur :", response.data);
      message.success("Demande envoyée avec succès !");

      // 🔥 Redirection vers la liste après ajout
      navigate("/polys");  
    } catch (error) {
      console.error("❌ Erreur lors de l'envoi :", error);
      message.error("Erreur lors de l'envoi du formulaire.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form layout="vertical" onFinish={onFinish}>
      <Form.Item name="filieres" label="Filières" rules={[{ required: true, message: "Champ obligatoire" }]}>
        <Input placeholder="1APET ou 2ASEI&SICOM" />
      </Form.Item>
      
      <Form.Item name="document_name" label="Nom du document" rules={[{ required: true }]}>
        <Input placeholder="Exemple : Poly Maths" />
      </Form.Item>

      <Form.Item name="enseignant" label="Enseignant" rules={[{ required: true }]}>
        <Input placeholder="Exemple : M. Dupont" />
      </Form.Item>

      <Form.Item name="mail" label="Mail">
        <Input placeholder="email@exemple.com" type="email" />
      </Form.Item>

      <Form.Item name="begin_course" label="Début du cours" rules={[{ required: true }]}>
        <DatePicker format="DD/MM/YYYY" />
      </Form.Item>

      <Form.Item name="reusable" valuePropName="checked">
        <Checkbox>Les polys des années précédentes peuvent être réutilisés</Checkbox>
      </Form.Item>

      <Form.Item name="chamilo_link" label="Lien Chamilo">
        <Input placeholder="https://chamilo.org/" />
      </Form.Item>

      <Form.Item name="semestre" label="Semestre" rules={[{ required: true }]}>
        <Select placeholder="Sélectionnez un semestre">
          {["S5", "S6", "S7", "S8", "S9", "S10"].map((sem) => (
            <Option key={sem} value={sem}>{sem}</Option>
          ))}
        </Select>
      </Form.Item>

      <Form.Item name="partie_number" label="Numéro de partie">
        <Input type="number" min={1} />
      </Form.Item>

      <Form.Item name="other_info" label="Autres infos">
        <Input.TextArea placeholder="Ajoutez des informations supplémentaires" />
      </Form.Item>

      <Form.Item name="num_copies" label="Nombre de copies">
        <Input type="number" min={1} />
      </Form.Item>

      <Form.Item>
        <Button type="primary" htmlType="submit" loading={loading}>
          Valider la commande
        </Button>
      </Form.Item>
    </Form>
  );
};

export default PolyForm;
