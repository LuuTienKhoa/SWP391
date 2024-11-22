import React, { useState, useEffect } from "react";
import { Layout, Statistic, Card, Row, Col, Button } from "antd";
import { DollarOutlined, LineChartOutlined } from "@ant-design/icons";
import { Line } from "@ant-design/charts";
import api from "../config/axios";
import { Link } from "react-router-dom";

const { Header, Content, Footer } = Layout;

const StaffPage = () => {
  const [completedOrders, setCompletedOrders] = useState([]);
  const [pendingCount, setPendingCount] = useState(0);
  const [cancelledCount, setCancelledCount] = useState(0);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [chartData, setChartData] = useState([]);
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await api.get("/Order");
        const orders = response.data;

        // Filter orders by status
        const completed = orders.filter((order) => order.status === 1);
        const pending = orders.filter((order) => order.status === 0);
        const cancelled = orders.filter((order) => order.status === 2);

        // Calculate revenue for completed orders
        const totalCompletedRevenue = completed.reduce(
          (sum, order) => sum + order.totalAmount,
          0
        );

        // Prepare chart data
        const chartData = completed
          .map((order) => ({
            date: new Date(order.createAt).toLocaleDateString("vi-VN"),
            amount: order.totalAmount,
          }))
          .sort((a, b) => new Date(a.date) - new Date(b.date));

        // Add trend arrows to chart data
        const trendWithArrows = chartData.map((entry, index, array) => {
          if (index === 0) return { ...entry, trend: "N/A" };
          const prevAmount = array[index - 1].amount;
          const trend = entry.amount > prevAmount ? "▲" : "▼";
          return { ...entry, trend };
        });

        setCompletedOrders(completed);
        setPendingCount(pending.length);
        setCancelledCount(cancelled.length);
        setTotalRevenue(totalCompletedRevenue);
        setChartData(trendWithArrows);
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    };

    fetchOrders();
  }, []);

  // Chart Configuration
  const chartConfig = {
    data: chartData,
    xField: "date",
    yField: "amount",
    smooth: true, // Smooth lines for better aesthetics
    label: {
      content: (dataItem) =>
        `${dataItem.amount.toLocaleString()} VND ${dataItem.trend}`,
      style: {
        fill: (dataItem) => (dataItem.trend === "▲" ? "green" : "red"),
        fontSize: 10,
      },
    },
    point: {
      size: 5,
      shape: "circle",
      style: {
        fill: "white",
        stroke: "#5B8FF9",
        lineWidth: 2,
      },
    },
    tooltip: {
      formatter: (dataItem) => ({
        name: "Doanh thu",
        value: `${dataItem.amount.toLocaleString()} VND ${dataItem.trend}`,
      }),
    },
    lineStyle: {
      stroke: "#5B8FF9",
      lineWidth: 2,
    },
    meta: {
      date: { alias: "Ngày" },
      amount: { alias: "Doanh thu (VND)" },
    },
  };

  return (
    <Layout>
      <Header style={{ color: "#fff", textAlign: "center", fontSize: "24px" }}>
        Quản Lí
      </Header>
      <Content style={{ padding: "20px" }}>
        {/* Statistics */}
        <Row gutter={[16, 16]} style={{ marginBottom: "20px" }}>
          <Col span={8}>
            <Statistic
              title="Tổng doanh thu"
              value={totalRevenue}
              precision={0}
              prefix={<DollarOutlined />}
              suffix="VND"
            />
          </Col>
          <Col span={8}>
            <Statistic
              title="Đơn hàng đã hoàn thành"
              value={completedOrders.length}
              prefix={<LineChartOutlined />}
            />
          </Col>
          <Col span={8}>
            <Statistic title="Đơn hàng đang chờ" value={pendingCount} />
          </Col>
          <Col span={8}>
            <Statistic title="Đơn hàng đã hủy" value={cancelledCount} />
          </Col>
        </Row>

        {/* Revenue Trend Chart */}
        <Card title="Biểu đồ xu hướng doanh thu" style={{ marginBottom: "20px" }}>
          <Line {...chartConfig} />
        </Card>

        {/* Quick Links */}
        <Row gutter={[16, 16]}>
          <Col span={12}>
            <Card>
              <Button block href="/staff">
                Quản lý đơn hàng
              </Button>
            </Card>
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
        Bảng điều khiển Koi Fish Shop ©2024
      </Footer>
    </Layout>
  );
};

export default StaffPage;
