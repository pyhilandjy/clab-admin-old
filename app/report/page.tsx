"use client";
import dayjs from "dayjs";
import { Button, Select } from "@chakra-ui/react";
import axios from "axios";
import { TuiDatePicker } from "nextjs-tui-date-picker";
import { useEffect, useState } from "react";
import "./report.css";
import Image from "next/image";
import { useRouter } from "next/navigation";

type User = {
  id: number;
  user_name: string;
};
type ActName = {
  act_name: string;
  id: number;
};

// 원래 User 선택하는 부분은 edit page 에도 있고, 여기에도 동일하니 따로 컴포넌트로 분리하는게 좋음.
// app/components/UserSelect.tsx 이런식으로 파일 만들어서 작성.
// Props로 정보를 받아서 처리하는 방식으로 구현.
const ReportPage = () => {
  const backendUrl = process.env.BACKEND_URL;
  const currentDate = dayjs().format("YYYY-MM-DD");
  const [users, setUsers] = useState([]);
  const [userId, setUserId] = useState("");
  const [startDate, setStartDate] = useState("2024-05-01");
  const [endDate, setEndDate] = useState(currentDate);
  const [reportData, setReportData] = useState<any>({});
  const [reportmorpsData, setMorpsReportData] = useState<any>({});
  const [reportActCountData, setActCountReportData] = useState<any>({});
  const [actName, setSpeechAct] = useState<ActName[]>([]);
  const [wordcloudimageSrc, setWordcloudImageSrc] = useState<any>(null);
  const [violinplotimageSrc, setViolinplotImageSrc] = useState(null);
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const checkLogin = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/login");
        return;
      }
      try {
        const response = await axios.get(`${backendUrl}/users/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (response.status === 200) {
          setIsLoggedIn(true);
        }
      } catch (error) {
        console.error("Error verifying user:", error);
        router.push("/login");
      }
    };
    checkLogin();
  }, [router]);

  useEffect(() => {
    if (isLoggedIn) {
      axios
        .post(`${backendUrl}/users/`)
        .then((response) => {
          setUsers(response.data);
        })
        .catch((error) => {
          console.error("There was an error!", error);
        });

      axios
        .get(`${backendUrl}/stt/get/speech_act/`)
        .then((response) => {
          setSpeechAct(response.data);
        })
        .catch((error) => {
          console.error("There was an error!", error);
        });
    }
  }, [isLoggedIn, backendUrl]);

  const handleStartDateChange = (date: Date) => {
    setStartDate(dayjs(date).format("YYYY-MM-DD"));
  };

  const handleEndDateChange = (date: Date) => {
    setEndDate(dayjs(date).format("YYYY-MM-DD"));
  };

  const handleSelectUser = (e: any) => {
    setUserId(e.target.value);
  };

  const handleCreteRportButtonClick = () => {
    console.log("Create Report Button Clicked");
    axios
      .post(backendUrl + "/stt/report/", {
        user_id: userId,
        start_date: startDate,
        end_date: endDate,
      })
      .then((response) => {
        console.log(response.data);
        setReportData(response.data);
      })
      .catch((error) => {
        console.error("There was an error!", error);
      });
  };

  const handleCretemorpsRportButtonClick = () => {
    console.log("Create morps Report Button Clicked");
    axios
      .post(backendUrl + "/stt/report/morps", {
        user_id: userId,
        start_date: startDate,
        end_date: endDate,
      })
      .then((response) => {
        console.log(response.data);
        setMorpsReportData(response.data);
      })
      .catch((error) => {
        console.error("There was an error!", error);
      });
  };

  const handleCreteActCountRportButtonClick = () => {
    console.log("Create ActCount Report Button Clicked");
    axios
      .post(backendUrl + "/stt/report/act_count", {
        user_id: userId,
        start_date: startDate,
        end_date: endDate,
      })
      .then((response) => {
        console.log(response.data);
        setActCountReportData(response.data);
      })
      .catch((error) => {
        console.error("There was an error!", error);
      });
  };

  const handleCreateWordCloudButtonClick = () => {
    console.log("Create Word Cloud Button Clicked");
    axios
      .post(backendUrl + "/stt/create/wordcloud/", {
        user_id: userId,
        start_date: startDate,
        end_date: endDate,
      })
      .then((response) => {
        console.log(response.data.local_image_paths);
        const localPaths = response.data.local_image_paths;
        if (Array.isArray(localPaths)) {
          const urls: any = localPaths.map(
            (path) => `${backendUrl}/stt/images/${path.split("/").pop()}`
          );
          setWordcloudImageSrc(urls);
        } else {
          console.error("There was an error!");
        }
      })
      .catch((error) => {
        console.error("There was an error!", error);
      });
  };

  const handleCreateViolinplotButtonClick = () => {
    console.log("Create Word Cloud Button Clicked");
    axios
      .post(
        backendUrl + "/stt/create/violinplot/",
        {
          user_id: userId,
          start_date: startDate,
          end_date: endDate,
        },
        { responseType: "blob" }
      )
      .then((response) => {
        console.log(response.data);
        const url: any = URL.createObjectURL(response.data);
        setViolinplotImageSrc(url);
      })
      .catch((error) => {
        console.error("There was an error!", error);
      });
  };

  if (!isLoggedIn) {
    return;
  }

  return (
    <div className="flex">
      <Select placeholder="Select option" onChange={handleSelectUser}>
        {users.map((user: User) => (
          <option key={user.id} value={user.id}>
            {user.user_name} {user.id}
          </option>
        ))}
      </Select>
      <div>
        start date
        <TuiDatePicker
          handleChange={handleStartDateChange}
          date={new Date(startDate)}
          inputWidth={140}
          fontSize={16}
        />
      </div>
      <div>
        end date
        <TuiDatePicker
          handleChange={handleEndDateChange}
          date={new Date(endDate)}
          inputWidth={140}
          fontSize={16}
        />
      </div>
      {/* 데이블 불러오는것 함수 분리 해야함 */}
      <Button onClick={handleCreteRportButtonClick}>Create Report</Button>
      {reportData && (
        <table>
          <thead>
            <tr>
              <th>Metric</th>
              <th>Value</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>가장 긴 문장</td>
              <td>{reportData["가장 긴 문장"]}</td>
            </tr>
            <tr>
              <td>평균 문장 길이</td>
              <td>{reportData["평균 문장 길이"]}</td>
            </tr>
            <tr>
              <td>녹음시간</td>
              <td>{reportData["녹음시간"]}</td>
            </tr>
          </tbody>
        </table>
      )}
      <Button onClick={handleCretemorpsRportButtonClick}>
        Create Morps Report
      </Button>
      {reportmorpsData && (
        <table>
          <thead>
            <tr>
              <th>Speaker</th>
              <th>고유명사</th>
              <th>명사</th>
              <th>대명사</th>
              <th>동사</th>
              <th>형용사</th>
              <th>부사</th>
              <th>총단어 수</th>
            </tr>
          </thead>
          <tbody>
            {Object.keys(reportmorpsData).map((speaker) => (
              <tr key={speaker}>
                <td>{speaker}</td>
                <td>{reportmorpsData[speaker]["고유명사"]}</td>
                <td>{reportmorpsData[speaker]["명사"]}</td>
                <td>{reportmorpsData[speaker]["대명사"]}</td>
                <td>{reportmorpsData[speaker]["동사"]}</td>
                <td>{reportmorpsData[speaker]["형용사"]}</td>
                <td>{reportmorpsData[speaker]["부사"]}</td>
                <td>{reportmorpsData[speaker]["총단어 수"]}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      <Button onClick={handleCreteActCountRportButtonClick}>
        Create ActCount Report
      </Button>
      {reportActCountData && (
        <table>
          <thead>
            <tr>
              <th>Speaker</th>
              {actName.map((act) => (
                <th key={act.id}>{act.act_name}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {Object.keys(reportActCountData).map((speaker) => (
              <tr key={speaker}>
                <td>{speaker}</td>
                {actName.map((act) => (
                  <td key={act.id}>
                    {reportActCountData[speaker][act.act_name] || 0}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      )}
      <div>
        <Button onClick={handleCreateWordCloudButtonClick}>
          Generate Word Cloud
        </Button>
        {wordcloudimageSrc &&
          wordcloudimageSrc.map((src: any, index: any) => (
            <Image
              key={index}
              src={src}
              alt={`Word Cloud ${index + 1}`}
              width={500}
              height={500}
              style={{ margin: "10px" }}
            />
          ))}
        <Button onClick={handleCreateViolinplotButtonClick}>
          Generate Violin Plot
        </Button>
        {violinplotimageSrc && (
          <Image
            src={violinplotimageSrc}
            alt="ViolinPlot"
            width={500}
            height={500}
            className="violingplot-image"
          />
        )}
      </div>
    </div>
  );
};

export default ReportPage;
