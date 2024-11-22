import React, { useState, useEffect } from "react";
import { Layout, Card ,Row,Col,Button} from "antd";
import { Column } from "@ant-design/charts";
import api from "../../config/axios";
import { Link } from "react-router-dom";
const { Header, Content, Footer } = Layout;

const KoiManagementPage = () => {
  const [koiData, setKoiData] = useState([]);
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    const fetchKoiData = async () => {
      try {
        const response = await api.get("/koi/Koi/available");
        const data = response.data;

        // Process data to get chart metrics (e.g., species distribution)
        const speciesCount = data.reduce((acc, koi) => {
          const species = koi.species.split(", ")[0]; // Take the primary species
          acc[species] = (acc[species] || 0) + 1;
          return acc;
        }, {});

        const processedChartData = Object.entries(speciesCount).map(
          ([species, count]) => ({
            species,
            count,
          })
        );

        setKoiData(data);
        setChartData(processedChartData);
      } catch (error) {
        console.error("Error fetching koi data:", error);
      }
    };

    fetchKoiData();
  }, []);

  // Chart Configuration
  const chartConfig = {
    data: chartData,
    xField: "species",
    yField: "count",
    columnWidthRatio: 0.8,
    label: {
      position: "middle",
      style: {
        fill: "#FFFFFF",
        opacity: 0.6,
      },
    },
    xAxis: {
      label: {
        autoRotate: true,
      },
    },
    tooltip: {
      formatter: (datum) => ({
        name: "Số lượng",
        value: datum.count,
      }),
    },
    meta: {
      species: { alias: "Loài cá" },
      count: { alias: "Số lượng" },
    },
  };

  return (
    <Layout>
      <Header style={{ color: "#fff", textAlign: "center", fontSize: "24px" }}>
        Quản Lý Koi
      </Header>
      <Content style={{ padding: "20px" }}>
        <Card title="Thống kê số lượng Koi đã bán theo loài">
          <Column {...chartConfig} />
        </Card>
        {/* Quick Links */}
        <Row gutter={[16, 16]}>
          <Col span={12}>
          <Link to="/staff">
          <Card>
              <Button type="default" block>
                Quản lý đơn hàng
              </Button>
            </Card>
          </Link>
          </Col>
          <Col span={12}>
            <Card>
              <Link to="/staff/koi-management">
                <Button type="default" block>
                  Quản lý Koi
                </Button>
              </Link>
            </Card>
          </Col>
        </Row>
      </Content>
      <Footer style={{ textAlign: "center" }}>
        Quản Lý Koi ©2024
      </Footer>
    </Layout>
  );
};

export default KoiManagementPage;
