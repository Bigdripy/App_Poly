import React from "react";
import { Layout, Menu } from "antd";
import {
  DashboardOutlined,
  FileTextOutlined,
  PrinterOutlined,
  UserOutlined,
  LogoutOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

const { Sider } = Layout;

const Sidebar = () => {
  const navigate = useNavigate();

  return (
    <Sider collapsible style={{ height: "100vh", position: "fixed", left: 0 }}>
      <div className="logo" style={{ color: "white", textAlign: "center", padding: "16px", fontSize: "18px" }}>
        PolyManager
      </div>
      <Menu theme="dark" mode="inline" defaultSelectedKeys={["1"]}>
        <Menu.Item key="1" icon={<DashboardOutlined />} onClick={() => navigate("/")}>
          Tableau de Bord
        </Menu.Item>
        <Menu.Item key="2" icon={<FileTextOutlined />} onClick={() => navigate("/polys")}>
          Commandes de Polys
        </Menu.Item>
        <Menu.Item key="3" icon={<FileTextOutlined />} onClick={() => navigate("/Demande d'impression")}>
          Demande
        </Menu.Item>
        <Menu.Item key="4" icon={<PrinterOutlined />} onClick={() => navigate("/impressions")}>
          Gestion des Impressions
        </Menu.Item>
        <Menu.Item key="5" icon={<UserOutlined />} onClick={() => navigate("/users")}>
          Utilisateurs
        </Menu.Item>
        <Menu.Item key="6" icon={<LogoutOutlined />} onClick={() => console.log("Déconnexion")}>
          Déconnexion
        </Menu.Item>
      </Menu>
    </Sider>
  );
};

export default Sidebar;
