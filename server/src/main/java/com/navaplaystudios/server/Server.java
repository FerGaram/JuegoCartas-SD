/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 */

package com.navaplaystudios.server;

import java.io.*;
import java.net.*;
import java.util.function.Consumer;

/**
 *
 * @author ferga
 */
class ConexionCliente extends Thread{
    private ObjectOutputStream salida;
    private ObjectInputStream entrada;
    private Socket cliente;
    private String nombreJugador;
    private Server servidor;
    private boolean activo = true;
    
    public ConexionCliente(Socket cliente, String nombre, Server servidor) throws IOException {
        this.cliente = cliente;
        this.nombreJugador = nombre;
        this.servidor = servidor;
        this.salida = new ObjectOutputStream(this.cliente.getOutputStream());
        this.entrada = new ObjectInputStream(this.cliente.getInputStream());
    }
    
    @Override
    public void run() {
        try {
            while (activo) {
                Object mensaje = entrada.readObject();
//                servidor.procesarMensaje(mensaje.toString(), this);
            }
        } catch (IOException | ClassNotFoundException e) {
//            servidor.notificarEvento("Cliente " + nombreJugador + " desconectado");
        } finally {
            try {
                cerrarConexion();
            } catch (IOException e) {
                e.printStackTrace();
            }
        }
    }
    
    public void cerrarConexion() throws IOException {
        activo = false;
        if (salida != null) {
            salida.close();
        }
        if (entrada != null) {
            entrada.close();
        }
        if (cliente != null) {
            cliente.close();
        }
    }

    public void enviarDatos(String mensaje) throws IOException {
        if (salida != null && !cliente.isClosed()) {
            salida.writeObject(mensaje);
            salida.flush();
        }
    }

    public String getNombreJugador() {
        return nombreJugador;
    }
}

public class Server {

    private ServerSocket servidor;
    private Socket socket1, socket2, socket3;
    private ConexionCliente cliente1, cliente2;
    private Consumer<String> callbackMensaje;
    private boolean juegoActivo = false;
    private boolean servidorActivo = false;
    private boolean esperandoJugada = false;
    
    public static void main(String[] args) {
        System.out.println("Hello World!");
    }
    
    public Server(Consumer<String> callbackMensaje) {
        this.callbackMensaje = callbackMensaje;
    }
}
