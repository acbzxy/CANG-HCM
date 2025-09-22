package com.fpt.listener;

import java.sql.Connection;
import java.sql.SQLException;
import java.sql.Statement;

import javax.naming.Context;
import javax.naming.InitialContext;
import javax.naming.NamingException;
import javax.sql.DataSource;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class DataSourceConfig {
	
	@Value("${app.datasource.jndi-name}")
	private String jndiName;
	@Value("${app.datasource.schema-name}")
	private String schemaName;
    @Bean
    public DataSource dataSource() throws NamingException {
        Context ctx = new InitialContext();
        DataSource jndiDataSource = (DataSource) ctx.lookup(jndiName);

        // Wrap lại để inject ALTER SESSION
        return new DataSource() {
            @Override
            public Connection getConnection() throws SQLException {
                Connection conn = jndiDataSource.getConnection();
                alterSession(conn);
                return conn;
            }

            @Override
            public Connection getConnection(String username, String password) throws SQLException {
                Connection conn = jndiDataSource.getConnection(username, password);
                alterSession(conn);
                return conn;
            }

            private void alterSession(Connection conn) {
            	if (!schemaName.matches("[A-Za-z0-9_]+")) {
                    throw new IllegalArgumentException("Invalid schema name: " + schemaName);
                }
                try (Statement stmt = conn.createStatement()) {
                    stmt.execute("ALTER SESSION SET CURRENT_SCHEMA=" + schemaName);
                } catch (SQLException e) {
                    throw new RuntimeException("Failed to set schema", e);
                }
            }

            // Delegate remaining methods
            @Override
            public <T> T unwrap(Class<T> iface) throws SQLException {
                return jndiDataSource.unwrap(iface);
            }

            @Override
            public boolean isWrapperFor(Class<?> iface) throws SQLException {
                return jndiDataSource.isWrapperFor(iface);
            }

            @Override
            public java.io.PrintWriter getLogWriter() throws SQLException {
                return jndiDataSource.getLogWriter();
            }

            @Override
            public void setLogWriter(java.io.PrintWriter out) throws SQLException {
                jndiDataSource.setLogWriter(out);
            }

            @Override
            public void setLoginTimeout(int seconds) throws SQLException {
                jndiDataSource.setLoginTimeout(seconds);
            }

            @Override
            public int getLoginTimeout() throws SQLException {
                return jndiDataSource.getLoginTimeout();
            }

            @Override
            public java.util.logging.Logger getParentLogger() {
                try {
                    return jndiDataSource.getParentLogger();
                } catch (Exception e) {
                    throw new RuntimeException(e);
                }
            }
        };
    }
}
