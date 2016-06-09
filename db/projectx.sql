-- MySQL dump 10.13  Distrib 5.5.29, for Win32 (x86)
--
-- Host: localhost    Database: projectx
-- ------------------------------------------------------
-- Server version	5.5.29

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `fleets`
--

DROP TABLE IF EXISTS `fleets`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `fleets` (
  `id` int(5) NOT NULL AUTO_INCREMENT,
  `gameid` int(3) DEFAULT NULL,
  `playerid` int(3) DEFAULT NULL,
  `name` varchar(255) DEFAULT NULL,
  `tfnumber` int(5) DEFAULT NULL,
  `x` int(3) DEFAULT NULL,
  `y` int(3) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=25 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `fleets`
--

LOCK TABLES `fleets` WRITE;
/*!40000 ALTER TABLE `fleets` DISABLE KEYS */;
INSERT INTO `fleets` VALUES (2,1,1,'Third Legion',1211,4,2),(3,1,1,'Warfleet Alpha',4147,8,1),(17,1,1,'AAA',0,4,2),(18,1,1,'Test',46,4,4),(19,1,1,'Super',32,11,4),(20,1,2,'Testfleet AlÃ¼jha',657,12,7),(21,1,2,'Eta',11,8,1),(22,1,2,'bugger',11,3,8),(24,1,2,'ee',3,10,1);
/*!40000 ALTER TABLE `fleets` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `games`
--

DROP TABLE IF EXISTS `games`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `games` (
  `id` int(5) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) DEFAULT NULL,
  `status` varchar(255) DEFAULT NULL,
  `turn` int(3) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `games`
--

LOCK TABLES `games` WRITE;
/*!40000 ALTER TABLE `games` DISABLE KEYS */;
INSERT INTO `games` VALUES (1,'Army of Light','ongoing',1);
/*!40000 ALTER TABLE `games` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `jumpgates`
--

DROP TABLE IF EXISTS `jumpgates`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `jumpgates` (
  `id` int(3) NOT NULL AUTO_INCREMENT,
  `gameid` int(3) DEFAULT NULL,
  `owner` int(3) DEFAULT NULL,
  `x` int(3) DEFAULT NULL,
  `y` int(3) DEFAULT NULL,
  `turn_build` int(3) DEFAULT NULL,
  `damage` int(3) DEFAULT NULL,
  `useable` tinyint(1) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `jumpgates`
--

LOCK TABLES `jumpgates` WRITE;
/*!40000 ALTER TABLE `jumpgates` DISABLE KEYS */;
INSERT INTO `jumpgates` VALUES (3,1,1,4,2,0,0,1),(4,1,1,9,5,0,0,1),(5,1,1,4,2,0,0,1),(6,1,1,4,6,0,0,1),(7,1,1,9,5,0,0,1),(8,1,1,13,3,0,0,1);
/*!40000 ALTER TABLE `jumpgates` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `jumplanes`
--

DROP TABLE IF EXISTS `jumplanes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `jumplanes` (
  `id` int(5) NOT NULL AUTO_INCREMENT,
  `startGate` int(3) DEFAULT NULL,
  `endGate` int(3) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `jumplanes`
--

LOCK TABLES `jumplanes` WRITE;
/*!40000 ALTER TABLE `jumplanes` DISABLE KEYS */;
INSERT INTO `jumplanes` VALUES (2,3,4),(3,5,6),(4,7,8);
/*!40000 ALTER TABLE `jumplanes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `lanesteps`
--

DROP TABLE IF EXISTS `lanesteps`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `lanesteps` (
  `id` int(5) NOT NULL AUTO_INCREMENT,
  `jumplaneid` int(3) DEFAULT NULL,
  `x` int(3) DEFAULT NULL,
  `y` int(3) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=23 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `lanesteps`
--

LOCK TABLES `lanesteps` WRITE;
/*!40000 ALTER TABLE `lanesteps` DISABLE KEYS */;
INSERT INTO `lanesteps` VALUES (6,2,4,2),(7,2,4,3),(8,2,5,3),(9,2,6,4),(10,2,7,4),(11,2,8,5),(12,2,9,5),(13,3,4,2),(14,3,4,3),(15,3,4,4),(16,3,4,5),(17,3,4,6),(18,4,9,5),(19,4,10,5),(20,4,11,4),(21,4,12,4),(22,4,13,3);
/*!40000 ALTER TABLE `lanesteps` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `markers`
--

DROP TABLE IF EXISTS `markers`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `markers` (
  `id` int(3) NOT NULL AUTO_INCREMENT,
  `gameid` int(3) DEFAULT NULL,
  `playerid` int(3) DEFAULT NULL,
  `x` int(3) DEFAULT NULL,
  `y` int(3) DEFAULT NULL,
  `notes` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `markers`
--

LOCK TABLES `markers` WRITE;
/*!40000 ALTER TABLE `markers` DISABLE KEYS */;
INSERT INTO `markers` VALUES (3,1,1,5,10,'supplies ?'),(5,1,1,9,7,'re');
/*!40000 ALTER TABLE `markers` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `moves`
--

DROP TABLE IF EXISTS `moves`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `moves` (
  `id` int(5) NOT NULL AUTO_INCREMENT,
  `fleetid` int(3) DEFAULT NULL,
  `turn` int(3) DEFAULT NULL,
  `step` int(2) DEFAULT NULL,
  `x` int(3) DEFAULT NULL,
  `y` int(3) DEFAULT NULL,
  `hmp` int(1) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=93 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `moves`
--

LOCK TABLES `moves` WRITE;
/*!40000 ALTER TABLE `moves` DISABLE KEYS */;
INSERT INTO `moves` VALUES (16,20,1,0,12,6,24),(17,20,1,1,11,5,24),(33,18,1,0,4,5,1),(34,18,1,1,4,6,1),(35,18,1,2,3,6,3),(39,2,1,0,5,1,3),(40,2,1,1,6,2,3),(41,2,1,2,7,2,3),(84,17,1,0,4,3,1),(86,19,1,0,10,5,1),(87,19,1,1,9,5,1),(88,19,1,2,8,6,3),(89,3,1,0,9,1,24),(90,22,1,0,3,7,3),(91,22,1,1,3,6,3),(92,24,1,0,9,1,24);
/*!40000 ALTER TABLE `moves` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `planets`
--

DROP TABLE IF EXISTS `planets`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `planets` (
  `id` int(3) NOT NULL AUTO_INCREMENT,
  `gameid` int(3) DEFAULT NULL,
  `x` int(3) DEFAULT NULL,
  `y` int(3) DEFAULT NULL,
  `owner` int(3) DEFAULT NULL,
  `type` varchar(255) DEFAULT NULL,
  `enviroment` varchar(255) DEFAULT NULL,
  `name` varchar(255) DEFAULT NULL,
  `level` int(3) DEFAULT NULL,
  `baseIncome` int(4) DEFAULT NULL,
  `baseTrade` int(4) DEFAULT NULL,
  `notes_1` varchar(255) DEFAULT NULL,
  `notes_2` varchar(255) DEFAULT NULL,
  `notes_3` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `planets`
--

LOCK TABLES `planets` WRITE;
/*!40000 ALTER TABLE `planets` DISABLE KEYS */;
INSERT INTO `planets` VALUES (1,1,4,6,1,'Large Planet','Fertile','New Worlds',5,1500,500,NULL,NULL,NULL),(2,1,8,1,0,'Large Planet','Radiated','undefined',0,0,0,'Ancient Artifacts',NULL,NULL),(3,1,1,3,0,'Large Planet','Arid','undefined',0,0,0,NULL,NULL,NULL),(4,1,4,2,0,'Planet','Swamp','undefined',0,0,0,NULL,NULL,NULL),(5,1,8,4,1,'Moon','Barren','Sol',2,500,100,'Rare Metals',NULL,NULL),(6,1,11,2,0,'Large Asteroid Field','Barren','undefined',0,0,0,NULL,NULL,NULL),(7,1,2,1,1,'Small Asteroid Field','Barren','Im a Belt',1,250,50,NULL,NULL,NULL),(8,1,14,6,2,'Large Planet','Fertile','Testwelt',4,1000,250,NULL,NULL,NULL),(9,1,9,6,2,'Large Planet','Arid','Beta',4,1000,500,NULL,NULL,NULL);
/*!40000 ALTER TABLE `planets` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `player`
--

DROP TABLE IF EXISTS `player`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `player` (
  `id` int(3) NOT NULL AUTO_INCREMENT,
  `username` varchar(255) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  `access` int(3) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `player`
--

LOCK TABLES `player` WRITE;
/*!40000 ALTER TABLE `player` DISABLE KEYS */;
INSERT INTO `player` VALUES (1,'Chris','147147',1),(2,'Rag','147147',0);
/*!40000 ALTER TABLE `player` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `playerstatus`
--

DROP TABLE IF EXISTS `playerstatus`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `playerstatus` (
  `id` int(5) NOT NULL AUTO_INCREMENT,
  `gameid` int(3) DEFAULT NULL,
  `playerid` int(3) DEFAULT NULL,
  `turn` int(3) DEFAULT NULL,
  `status` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `playerstatus`
--

LOCK TABLES `playerstatus` WRITE;
/*!40000 ALTER TABLE `playerstatus` DISABLE KEYS */;
INSERT INTO `playerstatus` VALUES (1,1,1,1,'ready'),(2,1,2,1,'ready');
/*!40000 ALTER TABLE `playerstatus` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sectorspecials`
--

DROP TABLE IF EXISTS `sectorspecials`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `sectorspecials` (
  `id` int(3) NOT NULL AUTO_INCREMENT,
  `gameid` int(3) DEFAULT NULL,
  `x` int(3) DEFAULT NULL,
  `y` int(3) DEFAULT NULL,
  `type` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sectorspecials`
--

LOCK TABLES `sectorspecials` WRITE;
/*!40000 ALTER TABLE `sectorspecials` DISABLE KEYS */;
INSERT INTO `sectorspecials` VALUES (2,1,6,3,'Supernova'),(4,1,9,5,'Nebula'),(5,1,2,2,'Black Hole'),(6,1,3,8,'Hyperspace Waveforms'),(7,1,10,8,'Radiation Cloud'),(8,1,14,2,'Vortex'),(9,1,8,2,'TEST A'),(10,1,8,2,'TEST B'),(11,1,8,2,'TEST C');
/*!40000 ALTER TABLE `sectorspecials` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `ships`
--

DROP TABLE IF EXISTS `ships`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `ships` (
  `id` int(5) NOT NULL AUTO_INCREMENT,
  `fleetid` int(3) DEFAULT NULL,
  `size` varchar(255) DEFAULT NULL,
  `model` varchar(255) DEFAULT NULL,
  `name` varchar(255) DEFAULT NULL,
  `elint` tinyint(1) DEFAULT NULL,
  `scanner` int(3) DEFAULT NULL,
  `jumpdrive` tinyint(1) DEFAULT NULL,
  `notes` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ships`
--

LOCK TABLES `ships` WRITE;
/*!40000 ALTER TABLE `ships` DISABLE KEYS */;
INSERT INTO `ships` VALUES (1,17,'HCV','Cronos','Wolf Leader',0,8,1,''),(2,17,'HCV','Cronos','B',0,8,1,''),(3,17,'HCV','Cronos','C',0,8,1,''),(4,2,'CAP','Omega','Overlord',0,8,1,''),(5,2,'MCV','Tethys','Little One',0,6,0,''),(6,3,'MCV','Tethys','A',0,6,0,''),(7,3,'MCV','Tethys','A',1,6,0,''),(8,18,'Cap','Hyperion','Grand',0,6,1,''),(9,19,'Cap','Hyperion','God',0,6,1,''),(10,20,'MCV','Jasha','test 1',1,6,0,''),(11,21,'MCV','Jash','Godless',0,6,0,''),(12,21,'MCV','Jash','Godless',0,6,0,''),(13,21,'Cap','Targath','Godless',0,6,0,''),(14,22,'Cap','Hecate','Godless',0,6,1,''),(15,22,'Cap','Hecate','Godless',0,6,1,''),(16,24,'MCV','Senshukar','tes',0,6,0,'');
/*!40000 ALTER TABLE `ships` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `subticks`
--

DROP TABLE IF EXISTS `subticks`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `subticks` (
  `id` int(5) NOT NULL AUTO_INCREMENT,
  `gameid` int(3) DEFAULT NULL,
  `turn` int(3) DEFAULT NULL,
  `subtick` int(3) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `subticks`
--

LOCK TABLES `subticks` WRITE;
/*!40000 ALTER TABLE `subticks` DISABLE KEYS */;
INSERT INTO `subticks` VALUES (1,1,1,0);
/*!40000 ALTER TABLE `subticks` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `validlanes`
--

DROP TABLE IF EXISTS `validlanes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `validlanes` (
  `id` int(5) NOT NULL AUTO_INCREMENT,
  `fleetid` int(3) DEFAULT NULL,
  `jumplaneid` int(3) DEFAULT NULL,
  `validForTurn` int(3) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `validlanes`
--

LOCK TABLES `validlanes` WRITE;
/*!40000 ALTER TABLE `validlanes` DISABLE KEYS */;
INSERT INTO `validlanes` VALUES (3,19,4,1),(4,18,3,1),(5,18,3,2),(6,18,3,2),(7,18,3,2),(8,2,3,2),(9,2,3,2),(10,17,2,2),(11,17,2,2),(12,17,3,2),(13,19,NULL,2);
/*!40000 ALTER TABLE `validlanes` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2016-06-08 22:08:13
