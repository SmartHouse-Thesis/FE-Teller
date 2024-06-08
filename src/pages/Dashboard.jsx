import React, { useEffect, useState } from 'react';
import { Table, Spin, message, DatePicker, Card, Row, Col } from 'antd';
import { useMutation } from '@tanstack/react-query';
import { Bar, Pie } from 'react-chartjs-2';
import dayjs from 'dayjs';
import 'dayjs/locale/vi';
import Chart from 'chart.js/auto';
import '../../public/css/Dashboard.css';
import statisAPI from '../api/static';

dayjs.locale('vi');

export function Dashboard() {
  const [transactions, setTransactions] = useState([]);
  const [month, setMonth] = useState(dayjs().month() + 1); // Default to current month
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();

  const { mutate: mutateData } = useMutation({
    mutationFn: (month) => statisAPI.getStatis(month),
    onSuccess: (response) => {
      setFilteredTransactions(response);
      setLoading(false);
    },
    onError: () => {
     
      setLoading(false);
    },
  });

  useEffect(() => {
    setLoading(true);
    mutateData(month);
  }, [month]);

  const calculateStatistics = (data) => {
    const totalAmount = data.reduce((acc, item) => acc + item.amount, 0);
    const transactionCount = data.length;
    const averageAmount = transactionCount ? (totalAmount / transactionCount).toFixed(2) : 0;
    return { totalAmount, transactionCount, averageAmount };
  };

  const handleMonthChange = (date) => {
    if (date) {
      const selectedMonth = date.month() + 1;
      setMonth(selectedMonth);
    }
  };

  const statistics = calculateStatistics(filteredTransactions);

  const barChartData = {
    labels: filteredTransactions.map(item => item.contractId),
    datasets: [
      {
        label: 'Số tiền',
        data: filteredTransactions.map(item => item.amount),
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
      },
    ],
  };

  const pieChartData = {
    labels: ['Tổng số tiền', 'Số tiền trung bình', 'Số lượng giao dịch'],
    datasets: [
      {
        data: [statistics.totalAmount, statistics.averageAmount, statistics.transactionCount],
        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
      },
    ],
  };

  const columns = [
    {
      title: 'Mã hợp đồng',
      dataIndex: 'contractId',
      key: 'contractId',
    },
    // {
    //   title: 'Tên',
    //   dataIndex: 'name',
    //   key: 'name',
    // },
    {
      title: 'Phương thức thanh toán',
      dataIndex: 'paymentMethod',
      key: 'paymentMethod',
    },
    {
      title: 'Số tiền',
      dataIndex: 'amount',
      key: 'amount',
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
    },
    // {
    //   title: 'Ngày tạo',
    //   dataIndex: 'createAt',
    //   key: 'createAt',
    //   render: (date) => dayjs(date).format('YYYY-MM-DD HH:mm:ss'),
    // },
  ];

  return (
    <>
      {contextHolder}
      <div style={{ padding: 24 }}>
        <h2>Thống kê doanh thu </h2>
        <Spin spinning={loading}>
          <div className="filter-section">
            <DatePicker picker="month" onChange={handleMonthChange} format="MM" />
          </div>
          <div className="statistics-section">
            <Row gutter={16}>
              <Col span={12}>
                <Card title="Tổng số tiền" bordered={false}>
                  {statistics.totalAmount.toLocaleString('vi-VN')} VND
                </Card>
              </Col>
              <Col span={12}>
                <Card title="Số lượng giao dịch" bordered={false}>
                  {statistics.transactionCount}
                </Card>
              </Col>
              {/* <Col span={8}>
                <Card title="Số tiền trung bình" bordered={false}>
                  {statistics.averageAmount.toLocaleString('vi-VN')} VND
                </Card>
              </Col> */}
            </Row>
          </div>
          <div className="flex gap-5">
            <div className="chart-section w-1/2">
              <h3>Biểu Đồ Giao Dịch</h3>
              <Bar data={barChartData} />
            </div>
            {/* <div className="chart-section w-1/2">
              <h3>Biểu Đồ Tổng Quan</h3>
              <Pie data={pieChartData} />
            </div> */}
            <div className="table-section w-1/2" >
            <Table columns={columns} dataSource={filteredTransactions} rowKey="id" />
          </div>
          </div>

        </Spin>
      </div>
    </>
  );
}