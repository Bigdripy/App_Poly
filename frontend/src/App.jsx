import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Layout } from "antd";
import Sidebar from "./components/Sidebar";
import PolyList from "./components/PolyList"; // Exemple de page
import PrintManager from "./components/PrintManager"; // Exemple de page
import PolyForm from "./components/PolyForm";   // Exemple de page

const { Content } = Layout;

const App = () => {
  return (
    <Router>
      <Layout style={{ minHeight: "100vh" }}>
        <Sidebar />
        <Layout style={{ marginLeft: 200, padding: "20px" }}>
          <Content>
            <Routes>
              <Route path="/" element={<h1>Tableau de Bord</h1>} />
              <Route path="/polys" element={<PolyList />} />
              <Route path="/Demande d'impression" element={<PolyForm  />} />
              <Route path="/impressions" element={<PrintManager />} />
              <Route path="/users" element={<h1>Utilisateurs</h1>} />
            </Routes>
          </Content>
        </Layout>
      </Layout>
    </Router>
  );
};

export default App;
