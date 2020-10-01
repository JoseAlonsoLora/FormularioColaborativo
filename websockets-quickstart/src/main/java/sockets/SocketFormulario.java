package sockets;

import javax.enterprise.context.ApplicationScoped;
import javax.websocket.*;
import javax.websocket.server.PathParam;
import javax.websocket.server.ServerEndpoint;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@ApplicationScoped
@ServerEndpoint("/formulario/{folio}")
public class SocketFormulario {
    private Map<String, List<Session>> socketSessions = new HashMap<>();

    @OnOpen
    public void onOpen(Session session, @PathParam("folio") String folio) {
        if(socketSessions.get(folio) == null){
            List<Session> sessionsFormulario = new ArrayList();
            sessionsFormulario.add(session);
            socketSessions.put(folio, sessionsFormulario);
        } else {
            socketSessions.get(folio).add(session);
        }
    }

    @OnClose
    public void onClose(Session session, @PathParam("username") String username) {

    }

    @OnError
    public void onError(Session session, @PathParam("username") String username, Throwable throwable) {
    }

    @OnMessage
    public void onMessage(String message, @PathParam("folio") String folio) {
        socketSessions.get(folio).forEach(
                sessionUser -> sessionUser.getAsyncRemote().sendText(message)
        );
    }
}
