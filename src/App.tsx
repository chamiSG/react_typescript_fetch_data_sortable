import "./styles.css";
import { useEffect, useState, useMemo } from "react";

interface IConfirmedData {
  uid: number;
  provinceState: string;
  countryRegion: string;
  lastUpdate: number;
}

export default function App() {
  const [isLoading, setIsLoading] = useState(false);
  const [confirmedData, setConfirmedData] = useState<IConfirmedData[]>([]);
  const [sortField, setSortField] = useState({
    key: "provinceState",
    direction: "asc"
  });

  const sortedConfirmedData = useMemo(() => {
    if (confirmedData.length === 0) {
      return [];
    }
    const sortableItems = [...confirmedData];
    sortableItems.sort((a: any, b: any) => {
      if (a[sortField.key] === null) {
        return sortField.direction === "asc" ? 1 : -1;
      }
      if (b[sortField.key] === null) {
        return sortField.direction === "asc" ? -1 : 1;
      }
      if (a[sortField.key] < b[sortField.key]) {
        return sortField.direction === "asc" ? -1 : 1;
      }
      if (a[sortField.key] > b[sortField.key]) {
        return sortField.direction === "asc" ? 1 : -1;
      }
      return 0;
    });

    return sortableItems;
  }, [confirmedData, sortField]);

  const handleSort = (key: string) => {
    let direction = "asc";
    if (sortField.key === key && sortField.direction === "asc") {
      direction = "desc";
    }
    setSortField({ key, direction });
  };

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      const response = await fetch("https://covid19.mathdro.id/api");
      const data = await response.json();
      const response1 = await fetch(data?.confirmed.detail);
      const data1 = await response1.json();
      setConfirmedData(data1);
      setIsLoading(false);
    };

    fetchData();
  }, []);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="App">
      <h1>Hello CodeSandbox</h1>
      <h2>Fetch Data uing api and Sort!</h2>

      <table>
        <thead>
          <tr>
            <th>No</th>
            <th onClick={() => handleSort("provinceState")}>Province State</th>
            <th onClick={() => handleSort("countryRegion")}>Country Region</th>
            <th onClick={() => handleSort("lastUpdate")}>Last Update</th>
          </tr>
        </thead>
        <tbody>
          {sortedConfirmedData.length === 0 && (
            <tr>
              <td>No Data</td>
            </tr>
          )}
          {sortedConfirmedData.map((item, idx) => (
            <tr key={item.uid}>
              <td>{idx + 1}</td>
              <td>{item.provinceState ? item.provinceState : "-"}</td>
              <td>{item.countryRegion}</td>
              <td>{item.lastUpdate}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
