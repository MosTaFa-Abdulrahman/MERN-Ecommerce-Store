import useGetAllUsers from "../../hooks/admin/useGetAllUsers";
import useGetAllOrders from "../../hooks/admin/useGetAllOrders";
import useGetTotalSales from "../../hooks/admin/useGetTotalSales";
import useGetTotalSalesByDate from "../../hooks/admin/useGetTotalSalesByDate";
import Chart from "react-apexcharts";
import { useEffect, useState } from "react";
import AdminMenu from "./AdminMenu";
import Loader from "../../components/Loader";
import OrderList from "./OrderList";

// Icons
import { FaFirstOrderAlt } from "react-icons/fa6";
import { FaUserSecret } from "react-icons/fa";
import { FcSalesPerformance } from "react-icons/fc";

function AdminDashboard() {
  const { isLoading: loading, users: customers } = useGetAllUsers();
  const { isLoading: loadingTwo, orders } = useGetAllOrders();
  const { isLoading, totalSales: sales } = useGetTotalSales();
  const { totalSalesByDate: salesDetail } = useGetTotalSalesByDate();

  console.log(orders);

  const [state, setState] = useState({
    options: {
      chart: {
        type: "line",
      },
      tooltip: {
        theme: "dark",
      },
      colors: ["#00E396"],
      dataLabels: {
        enabled: true,
      },
      stroke: {
        curve: "smooth",
      },
      title: {
        text: "Sales Trend",
        align: "left",
      },
      grid: {
        borderColor: "#ccc",
      },
      markers: {
        size: 1,
      },
      xaxis: {
        categories: [],
        title: {
          text: "Date",
        },
      },
      yaxis: {
        title: {
          text: "Sales",
        },
        min: 0,
      },
      legend: {
        position: "top",
        horizontalAlign: "right",
        floating: true,
        offsetY: -25,
        offsetX: -5,
      },
    },
    series: [{ name: "Sales", data: [] }],
  });

  useEffect(() => {
    if (salesDetail) {
      const formattedSalesDate = salesDetail.map((item) => ({
        x: item._id,
        y: item.totalSales,
      }));

      setState((prevState) => ({
        ...prevState,
        options: {
          ...prevState.options,
          xaxis: {
            categories: formattedSalesDate.map((item) => item.x),
          },
        },

        series: [
          { name: "Sales", data: formattedSalesDate.map((item) => item.y) },
        ],
      }));
    }
  }, [salesDetail]);

  return (
    <>
      <AdminMenu />

      <section className="xl:ml-[4rem] md:ml-[0rem]">
        <div className="w-[80%] flex justify-around flex-wrap">
          <div className="rounded-lg bg-black p-5 w-[20rem] mt-5">
            {/* <div className="font-bold rounded-full w-[3rem] bg-pink-500 text-center p-3">
              $
            </div> */}
            <FcSalesPerformance style={{ fontSize: "35px" }} />

            <p className="mt-5">Sales</p>
            <h1 className="text-xl font-bold">
              $ {isLoading ? <Loader /> : sales?.toFixed(2)}
            </h1>
          </div>
          <div className="rounded-lg bg-black p-5 w-[20rem] mt-5">
            <div>
              <FaUserSecret style={{ fontSize: "35px" }} />
            </div>

            <p className="mt-5">Customers</p>
            <h1 className="text-xl font-bold">
              {isLoading ? <Loader /> : customers?.length}
            </h1>
          </div>
          <div className="rounded-lg bg-black p-5 w-[20rem] mt-5">
            <FaFirstOrderAlt style={{ fontSize: "35px" }} />

            <p className="mt-5">All Orders</p>
            <h1 className="text-xl font-bold">
              {isLoading ? <Loader /> : orders?.length}
            </h1>
          </div>
        </div>

        <div className="ml-[10rem] mt-[4rem]">
          <Chart
            options={state.options}
            series={state.series}
            type="bar"
            width="70%"
          />
        </div>

        <div className="mt-[4rem]">
          <OrderList />
        </div>
      </section>
    </>
  );
}

export default AdminDashboard;
