"use client";

import { useQueryClient } from "@tanstack/react-query";
import { useCallback } from "react";

import { QUERY_KEYS } from "@/shared/constants/query-keys";
import { useSocketContext } from "@/shared/providers/socket-provider";

import { useChatStore } from "../stores/use-chat-store";
import { ChatMessage, ChatRoom } from "../types";

type InfiniteMessagesData = {
  pages: { messages: ChatMessage[] }[];
  pageParams: (number | undefined)[];
};

export const useChatEvents = () => {
  const { socket } = useSocketContext();
  const queryClient = useQueryClient();
  const { setTyping, setRoomInactive } = useChatStore();

  /**
   * 메시지를 특정 채팅방의 메시지 캐시 맨 앞에 추가합니다.
   * handleNewMessage, handleUserLeft, handleUserRejoined에서 공통으로 사용됩니다.
   */
  const prependMessageToCache = useCallback(
    (roomId: number, message: ChatMessage) => {
      queryClient.setQueryData<InfiniteMessagesData>(
        QUERY_KEYS.chatKeys.messages(roomId).queryKey,
        (oldData) => {
          if (!oldData) return oldData;
          const newPages = [...oldData.pages];
          newPages[0] = {
            ...newPages[0],
            messages: [message, ...newPages[0].messages],
          };
          return { ...oldData, pages: newPages };
        }
      );
    },
    [queryClient]
  );

  const handleNewChatRoom = useCallback(
    (newRoom: ChatRoom) => {
      queryClient.setQueryData<ChatRoom[]>(
        QUERY_KEYS.chatKeys.rooms.queryKey,
        (oldData) => {
          if (oldData) {
            // 이미 존재하는 방이면 추가하지 않음
            if (oldData.some((room) => room.id === newRoom.id)) {
              return oldData;
            }
            return [newRoom, ...oldData];
          }
          return [newRoom];
        }
      );
    },
    [queryClient]
  );

  const handleNewMessage = useCallback(
    (newMessage: ChatMessage) => {
      const roomId = newMessage.chatRoom.id;

      // 채팅 상태를 한 번만 조회하여 재사용
      const { isChatOpen, activeChatRoomId } = useChatStore.getState();
      const isChatVisible = isChatOpen && activeChatRoomId === roomId;

      // 채팅방이 현재 열려 있고 활성화된 상태라면, 즉시 읽음 처리
      if (isChatVisible) {
        socket?.emit("markAsRead", { roomId });
      }

      // 메시지 캐시 업데이트
      prependMessageToCache(roomId, newMessage);

      // 채팅방 목록 업데이트: 마지막 메시지 & 안읽음 카운트 갱신
      queryClient.setQueryData<ChatRoom[]>(
        QUERY_KEYS.chatKeys.rooms.queryKey,
        (oldRooms) => {
          if (!oldRooms) return [];

          const updatedRooms = oldRooms.map((room) =>
            room.id === roomId
              ? {
                  ...room,
                  lastMessage: newMessage,
                  unreadCount: isChatVisible ? 0 : (room.unreadCount || 0) + 1,
                }
              : room
          );

          // 최신 메시지 기준으로 정렬
          return updatedRooms.sort(
            (a, b) =>
              new Date(b.lastMessage?.createdAt ?? 0).getTime() -
              new Date(a.lastMessage?.createdAt ?? 0).getTime()
          );
        }
      );
    },
    [queryClient, socket, prependMessageToCache]
  );

  const handleUserLeft = useCallback(
    ({ roomId, message }: { roomId: number; message: ChatMessage }) => {
      prependMessageToCache(roomId, message);
      setRoomInactive(roomId, true);
    },
    [prependMessageToCache, setRoomInactive]
  );

  const handleUserRejoined = useCallback(
    ({ roomId, message }: { roomId: number; message: ChatMessage }) => {
      prependMessageToCache(roomId, message);
      setRoomInactive(roomId, false);
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.chatKeys.rooms.queryKey,
      });
    },
    [queryClient, prependMessageToCache, setRoomInactive]
  );

  const handleTyping = useCallback(
    ({ nickname, isTyping }: { nickname: string; isTyping: boolean }) => {
      const { activeChatRoomId } = useChatStore.getState();
      if (activeChatRoomId) {
        setTyping(activeChatRoomId, isTyping ? nickname : "");
      }
    },
    [setTyping]
  );

  const registerChatEventListeners = useCallback(() => {
    if (!socket) return;
    socket.on("newChatRoom", handleNewChatRoom);
    socket.on("newMessage", handleNewMessage);
    socket.on("userLeft", handleUserLeft);
    socket.on("userRejoined", handleUserRejoined);
    socket.on("typing", handleTyping);
  }, [
    socket,
    handleNewChatRoom,
    handleNewMessage,
    handleUserLeft,
    handleUserRejoined,
    handleTyping,
  ]);

  const unregisterChatEventListeners = useCallback(() => {
    if (!socket) return;
    socket.off("newChatRoom", handleNewChatRoom);
    socket.off("newMessage", handleNewMessage);
    socket.off("userLeft", handleUserLeft);
    socket.off("userRejoined", handleUserRejoined);
    socket.off("typing", handleTyping);
  }, [
    socket,
    handleNewChatRoom,
    handleNewMessage,
    handleUserLeft,
    handleUserRejoined,
    handleTyping,
  ]);

  return { registerChatEventListeners, unregisterChatEventListeners };
};
