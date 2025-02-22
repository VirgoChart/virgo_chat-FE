import axiosRequest from "@/config/axios";

// Tạo cuộc gọi
export const createCall = async (roomId: string, token: string) => {
  const response = await axiosRequest.post(
    `/calls/create`,
    { roomId },
    {
      withCredentials: true,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data;
};

// Cập nhật trạng thái người tham gia cuộc gọi
export const updateParticipantCall = async (
  callId: string,
  status: string,
  token: string
) => {
  const response = await axiosRequest.put(
    `/calls/update/participant/${callId}`,
    { status },
    {
      withCredentials: true,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  console.log(response);
  return response;
};

// Cập nhật trạng thái cuộc gọi (missed, ended)
export const updateStatusCall = async (callId: string, token: string) => {
  const response = await axiosRequest.put(
    `${process.env.NEXT_PUBLIC_URL}/calls/update/status/${callId}`,
    {},
    {
      withCredentials: true,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data;
};
