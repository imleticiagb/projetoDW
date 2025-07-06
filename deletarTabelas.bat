@echo off
REM Define a senha
set PGPASSWORD=123456

REM Executa o comando psql
psql -h localhost -p 5432 -U postgres -d postgres -c "DELETE FROM public.registros;"

REM Limpa a variável de senha por segurança
set PGPASSWORD=
