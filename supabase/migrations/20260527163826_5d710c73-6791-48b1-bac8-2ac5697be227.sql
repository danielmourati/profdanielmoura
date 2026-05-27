
INSERT INTO public.flashcard_categories (name, slug, order_index) VALUES ('Redes', 'redes', 7);

WITH cat AS (SELECT id FROM public.flashcard_categories WHERE slug = 'redes')
INSERT INTO public.flashcards (category_id, difficulty, question, answer, order_index)
SELECT cat.id, d.difficulty::flashcard_difficulty, d.question, d.answer, d.ord
FROM cat, (VALUES
  ('facil',  'O que significa LAN?', 'Rede local', 1),
  ('facil',  'Dispositivo que conecta redes?', 'Roteador', 2),
  ('facil',  'Protocolo de internet (sigla)?', 'IP', 3),
  ('facil',  'Protocolo de transferência segura?', 'HTTPS', 4),
  ('facil',  'Máximo de hosts em /24?', '254 hosts', 5),
  ('facil',  'Porta padrão HTTP?', 'Porta 80', 6),
  ('facil',  'Cabo de rede mais comum?', 'Ethernet', 7),
  ('facil',  'Servidor de nomes (sigla)?', 'DNS', 8),
  ('facil',  'Protocolo de envio de e-mail?', 'SMTP', 9),
  ('facil',  'Camada de aplicação (modelo)?', 'Camada 7', 10),
  ('medio',  'Endereço MAC tem quantos octetos?', 'Seis octetos', 1),
  ('medio',  'Máscara 255.255.255.0 é?', '/24', 2),
  ('medio',  'Protocolo de configuração automática (sigla)?', 'DHCP', 3),
  ('medio',  'Gateway padrão pertence à qual camada?', 'Rede', 4),
  ('medio',  'Porta padrão HTTPS?', 'Porta 443', 5),
  ('medio',  'TCP é confiável ou?', 'Orientado conexão', 6),
  ('medio',  'UDP é rápido ou?', 'Sem conexão', 7),
  ('medio',  'Endereço 127.0.0.1 é?', 'Loopback local', 8),
  ('medio',  'Switch opera em qual camada?', 'Camada 2', 9),
  ('medio',  'ICMP serve para?', 'Ping tracert', 10),
  ('dificil','Subnetting /25 divide em?', 'Duas subredes', 1),
  ('dificil','IPv6 tem quantos bits?', '128 bits', 2),
  ('dificil','BGP é protocolo de?', 'Roteamento exterior', 3),
  ('dificil','MPLS trabalha em qual camada?', 'Camada 2.5', 4),
  ('dificil','QoS garante?', 'Qualidade serviço', 5),
  ('dificil','VLAN isola pelo?', 'Broadcast domain', 6),
  ('dificil','STP previne?', 'Loops camada 2', 7),
  ('dificil','OSI tem quantas camadas?', 'Sete camadas', 8),
  ('dificil','NAT mascara qual tipo?', 'Endereço IP privado', 9),
  ('dificil','EIGRP usa qual métrica?', 'Banda atraso confiabilidade', 10)
) AS d(difficulty, question, answer, ord);
