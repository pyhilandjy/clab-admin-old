"use client";
import { Input, Button, Select, Grid, GridItem } from "@chakra-ui/react";
import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

type User = {
  id: number;
  user_name: string;
};

type SttResult = {
  id: number;
  file_id: string;
  index: number;
  text_edited: string;
  speaker_label: string;
  act_id: number;
};
type SpeechAct = {
  act_name: string;
  id: number;
};

const EditPage = () => {
  const backendUrl = process.env.BACKEND_URL;
  const inputRefs = useRef<{ [key: number]: HTMLInputElement | null }>({});
  const [users, setUsers] = useState<User[]>([]);
  const [files, setFiles] = useState([]);
  const [sttResults, setSttResults] = useState<SttResult[]>([]);
  const [speechAct, setSpeechAct] = useState<SpeechAct[]>([]);
  const oldWordInputRef = useRef<HTMLInputElement | null>(null);
  const newWordInputRef = useRef<HTMLInputElement | null>(null);
  const oldSpeakerInputRef = useRef<HTMLInputElement | null>(null);
  const newSpeakerInputRef = useRef<HTMLInputElement | null>(null);
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

  const handleSelectUser = (e: any) => {
    axios
      .post(backendUrl + "/files/", {
        user_id: e.target.value,
      })
      .then((response) => {
        setFiles(response.data);
      })
      .catch((error) => {
        console.error("There was an error!", error);
      });
  };

  const handleSelectFileId = (e: any) => {
    axios
      .post(backendUrl + "/stt/results-by-file_id/", {
        file_id: e.target.value,
      })
      .then((response) => {
        setSttResults(response.data);
      })
      .catch((error) => {
        console.error("There was an error!", error);
      });
  };

  const handleOnSave = (sttResult: SttResult) => {
    const newText = inputRefs.current[sttResult.id]?.value;

    axios
      .post(backendUrl + "/stt/results/update_text_edit/", {
        file_id: sttResult.file_id,
        index: sttResult.index,
        new_text: newText,
      })
      .then((response) => {})
      .catch((error) => {
        console.error("There was an error!", error);
      });
  };

  const handleOnClickAdd = (sttResult: SttResult) => {
    axios
      .post(backendUrl + "/stt/results/posts/index_add_data/", {
        file_id: sttResult.file_id,
        selected_index: sttResult.index,
        new_index: sttResult.index + 1,
      })
      .then((response) => {
        return axios.post(backendUrl + "/stt/results-by-file_id/", {
          file_id: sttResult.file_id,
        });
      })
      .then((response) => {
        setSttResults(response.data);
        syncInputValues(response.data);
      })
      .catch((error) => {
        console.error("There was an error!", error);
      });
  };

  const handleOnClickDelete = (sttResult: SttResult) => {
    axios
      .post(backendUrl + "/stt/results/index_delete_data/", {
        file_id: sttResult.file_id,
        selected_index: sttResult.index,
      })
      .then((response) => {
        return axios.post(backendUrl + "/stt/results-by-file_id/", {
          file_id: sttResult.file_id,
        });
      })
      .then((response) => {
        setSttResults(response.data);
        syncInputValues(response.data);
      })
      .catch((error) => {
        console.error("There was an error!", error);
      });
  };

  const handleSelectSpeechAct = (sttResult: SttResult, e: any) => {
    axios
      .post(backendUrl + "/stt/update/act_id", {
        unique_id: sttResult.id,
        selected_act_name: e.target.value,
      })
      .then((response) => {})
      .catch((error) => {
        console.error("There was an error!", error);
      });
  };

  const handleTextChangeButtonClick = () => {
    const oldWord = oldWordInputRef.current?.value;
    const newWord = newWordInputRef.current?.value;
    axios
      .post(backendUrl + "/stt/results/update_text/", {
        file_id: sttResults[0].file_id,
        old_text: oldWord,
        new_text: newWord,
      })
      .then((response) => {
        return axios.post(backendUrl + "/stt/results-by-file_id/", {
          file_id: sttResults[0].file_id,
        });
      })
      .then((response) => {
        setSttResults(response.data);
        syncInputValues(response.data);
      })
      .catch((error) => {
        console.error("There was an error!", error);
      });
  };
  const handleSpeakerChangeButtonClick = () => {
    const oldSpeaker = oldSpeakerInputRef.current?.value;
    const newSpeaker = newSpeakerInputRef.current?.value;
    axios
      .post(backendUrl + "/stt/results/update_Speaker/", {
        file_id: sttResults[0].file_id,
        old_Speaker: oldSpeaker,
        new_Speaker: newSpeaker,
      })
      .then((response) => {
        return axios.post(backendUrl + "/stt/results-by-file_id/", {
          file_id: sttResults[0].file_id,
        });
      })
      .then((response) => {
        setSttResults(response.data);
        syncInputValues(response.data);
      })
      .catch((error) => {
        console.error("There was an error!", error);
      });
  };

  const getActNameById = (id: number): string => {
    const act = speechAct.find((act: SpeechAct) => act.id === id) as
      | SpeechAct
      | undefined;
    return act ? act.act_name : "";
  };

  const syncInputValues = (updatedResults: SttResult[]) => {
    updatedResults.forEach((result) => {
      const inputRef = inputRefs.current[result.id];
      if (inputRef) {
        inputRef.value = result.text_edited;
      }
    });
  };

  if (!isLoggedIn) {
    return;
  }
  return (
    <div>
      <Select placeholder="Select option" onChange={handleSelectUser}>
        {users.map((user: User) => (
          <option key={user.id} value={user.id}>
            {user.user_name} {user.id}
          </option>
        ))}
      </Select>
      <Select placeholder="Select option" onChange={handleSelectFileId} mt={2}>
        {files.map((file: any) => (
          <option key={file.id} value={file.id}>
            {file.id}
          </option>
        ))}
      </Select>
      <Grid templateColumns="repeat(4, 1fr)" gap={4} mt={3}>
        <GridItem>
          <Input placeholder="Old Word" ref={oldWordInputRef} />
        </GridItem>
        <GridItem>
          <Input placeholder="New Word" ref={newWordInputRef} />
        </GridItem>
        <GridItem>
          <Input placeholder="Old Speaker" ref={oldSpeakerInputRef} />
        </GridItem>
        <GridItem>
          <Input placeholder="New Speaker" ref={newSpeakerInputRef} />
        </GridItem>
      </Grid>

      <Grid templateColumns="repeat(2, 1fr)" gap={4} mt={1}>
        <GridItem>
          <Button onClick={handleTextChangeButtonClick}>word replace</Button>
        </GridItem>
        <GridItem>
          <Button onClick={handleSpeakerChangeButtonClick}>
            Speaker replace
          </Button>
        </GridItem>
      </Grid>
      <div style={{ marginTop: "40px" }}>
        {sttResults.map((sttResult) => (
          <div key={sttResult.id} style={{ marginBottom: "16px" }}>
            <Input
              defaultValue={sttResult.text_edited}
              ref={(el): any => (inputRefs.current[sttResult.id] = el)}
            />
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                marginTop: "3px",
              }}
            >
              <Button onClick={() => handleOnSave(sttResult)}>save</Button>
              <Button onClick={() => handleOnClickAdd(sttResult)}>add</Button>
              <Button onClick={() => handleOnClickDelete(sttResult)}>
                delete
              </Button>
              <Select
                placeholder={getActNameById(sttResult.act_id)}
                onChange={(e) => handleSelectSpeechAct(sttResult, e)}
              >
                {speechAct.map((speechact) => (
                  <option key={speechact.id} value={speechact.act_name}>
                    {speechact.act_name}
                  </option>
                ))}
              </Select>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
export default EditPage;
