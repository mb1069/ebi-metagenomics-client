-- MySQL dump 10.13  Distrib 5.6.33, for debian-linux-gnu (x86_64)
--
-- Host: mysql-vm-076.ebi.ac.uk    Database: emg
-- ------------------------------------------------------
-- Server version	5.6.33

--
-- Dumping data for table `DOWNLOAD_DESCRIPTION_LABEL`
--
INSERT INTO `DOWNLOAD_DESCRIPTION_LABEL` VALUES (1,'Processed nucleotide reads.','Processed nucleotide reads');
INSERT INTO `DOWNLOAD_DESCRIPTION_LABEL` VALUES (3,'Processed nucleotide reads (since pipeline version 2.0).','Processed nucleotide readsProcessed nucleotide reads.');
INSERT INTO `DOWNLOAD_DESCRIPTION_LABEL` VALUES (4,'All reads that have predicted CDS.','Processed reads with pCDS');
INSERT INTO `DOWNLOAD_DESCRIPTION_LABEL` VALUES (5,'All reads with an interproscan match.','Processed reads with annotation');
INSERT INTO `DOWNLOAD_DESCRIPTION_LABEL` VALUES (6,'All reads with a predicted CDS but no interproscan match.','Processed reads without annotation');
INSERT INTO `DOWNLOAD_DESCRIPTION_LABEL` VALUES (7,'All predicted CDS.','Predicted CDS');
INSERT INTO `DOWNLOAD_DESCRIPTION_LABEL` VALUES (8,'Predicted coding sequences with InterPro match (FASTA).','Predicted CDS with annotation');
INSERT INTO `DOWNLOAD_DESCRIPTION_LABEL` VALUES (9,'Predicted CDS without annotation.','Predicted CDS without annotation');
INSERT INTO `DOWNLOAD_DESCRIPTION_LABEL` VALUES (10,'Predicted open reading frames without annotation (FASTA).','Predicted ORF without annotation');
INSERT INTO `DOWNLOAD_DESCRIPTION_LABEL` VALUES (11,'All reads encoding 5S rRNA.','Reads encoding 5S rRNA');
INSERT INTO `DOWNLOAD_DESCRIPTION_LABEL` VALUES (12,'All reads encoding 16S rRNA.','Reads encoding 16S rRNA');
INSERT INTO `DOWNLOAD_DESCRIPTION_LABEL` VALUES (13,'All reads encoding 23S rRNA.','Reads encoding 23S rRNA');
INSERT INTO `DOWNLOAD_DESCRIPTION_LABEL` VALUES (14,'OTUs and taxonomic assignments.','OTUs, reads and taxonomic assignments');
INSERT INTO `DOWNLOAD_DESCRIPTION_LABEL` VALUES (15,'Phylogenetic tree (Newick format).','Phylogenetic tree');
INSERT INTO `DOWNLOAD_DESCRIPTION_LABEL` VALUES (16,'All reads encoding SSU rRNA.','Reads encoding SSU rRNA');
INSERT INTO `DOWNLOAD_DESCRIPTION_LABEL` VALUES (17,'OTUs and taxonomic assignments for SSU rRNA.','OTUs, reads and taxonomic assignments for SSU rRNA');
INSERT INTO `DOWNLOAD_DESCRIPTION_LABEL` VALUES (18,'All reads encoding LSU rRNA.','Reads encoding LSU rRNA');
INSERT INTO `DOWNLOAD_DESCRIPTION_LABEL` VALUES (19,'OTUs and taxonomic assignments for LSU rRNA.','OTUs, reads and taxonomic assignments for LSU rRNA');
INSERT INTO `DOWNLOAD_DESCRIPTION_LABEL` VALUES (20,'InterPro matches (TSV).','InterPro matches');
INSERT INTO `DOWNLOAD_DESCRIPTION_LABEL` VALUES (21,'Complete GO annotation.','Complete GO annotation');
INSERT INTO `DOWNLOAD_DESCRIPTION_LABEL` VALUES (22,'GO slim annotation.','GO slim annotation');
INSERT INTO `DOWNLOAD_DESCRIPTION_LABEL` VALUES (23,'tRNAs predicted using HMMER tools.','Predicted tRNAs');
INSERT INTO `DOWNLOAD_DESCRIPTION_LABEL` VALUES (24,'Phylum level taxonomies (TSV).','Phylum level taxonomies');
INSERT INTO `DOWNLOAD_DESCRIPTION_LABEL` VALUES (25,'Taxonomic assignments (TSV).','Taxonomic assignments');
INSERT INTO `DOWNLOAD_DESCRIPTION_LABEL` VALUES (26,'Taxonomic diversity metrics (TSV).','Taxonomic diversity metrics');
INSERT INTO `DOWNLOAD_DESCRIPTION_LABEL` VALUES (27,'Taxonomic diversity metrics SSU rRNA (TSV).','Taxonomic diversity metrics SSU');
INSERT INTO `DOWNLOAD_DESCRIPTION_LABEL` VALUES (28,'Taxonomic diversity metrics LSU rRNA (TSV).','Taxonomic diversity metrics LSU');
INSERT INTO `DOWNLOAD_DESCRIPTION_LABEL` VALUES (29,'Phylum level taxonomies SSU (TSV).','Phylum level taxonomies SSU');
INSERT INTO `DOWNLOAD_DESCRIPTION_LABEL` VALUES (30,'Phylum level taxonomies LSU (TSV).','Phylum level taxonomies LSU');
INSERT INTO `DOWNLOAD_DESCRIPTION_LABEL` VALUES (31,'Taxonomic assignments SSU (TSV).','Taxonomic assignments SSU');
INSERT INTO `DOWNLOAD_DESCRIPTION_LABEL` VALUES (32,'Taxonomic assignments LSU (TSV).','Taxonomic assignments LSU');
INSERT INTO `DOWNLOAD_DESCRIPTION_LABEL` VALUES (33,'Predicted alpha tmRNA','Predicted alpha tmRNA');
INSERT INTO `DOWNLOAD_DESCRIPTION_LABEL` VALUES (34,'Predicted Alphaproteobacteria transfer-messenger RNA (RF01849)','Predicted alpha tmRNA');
INSERT INTO `DOWNLOAD_DESCRIPTION_LABEL` VALUES (35,'Predicted Archaeal signal recognition particle RNA (RF01857)','Predicted Archaea SRP RNA');
INSERT INTO `DOWNLOAD_DESCRIPTION_LABEL` VALUES (36,'Predicted Bacterial large signal recognition particle RNA (RF01854)','Predicted Bacteria large SRP RNA');
INSERT INTO `DOWNLOAD_DESCRIPTION_LABEL` VALUES (37,'Predicted Bacterial small signal recognition particle RNA (RF00169)','Predicted Bacteria small SRP RNA');
INSERT INTO `DOWNLOAD_DESCRIPTION_LABEL` VALUES (38,'Predicted Betaproteobacteria transfer-messenger RNA (RF01850)','Predicted beta tmRNA');
INSERT INTO `DOWNLOAD_DESCRIPTION_LABEL` VALUES (39,'Predicted Cyanobacteria transfer-messenger RNA (RF01851)','Predicted cyano tmRNA');
INSERT INTO `DOWNLOAD_DESCRIPTION_LABEL` VALUES (40,'Predicted Dictyostelium signal recognition particle RNA (RF01570)','Predicted Dictyostelium SRP RNA');
INSERT INTO `DOWNLOAD_DESCRIPTION_LABEL` VALUES (41,'Predicted Fungal signal recognition particle RNA (RF01502)','Predicted Fungi SRP RNA');
INSERT INTO `DOWNLOAD_DESCRIPTION_LABEL` VALUES (42,'Predicted Metazoan signal recognition particle RNA (RF00017)','Predicted Metazoa SRP RNA');
INSERT INTO `DOWNLOAD_DESCRIPTION_LABEL` VALUES (43,'Predicted Mitochondrion-encoded tmRNA (RF02544)','Predicted mt-tmRNA');
INSERT INTO `DOWNLOAD_DESCRIPTION_LABEL` VALUES (44,'Predicted Plant signal recognition particle RNA (RF01855)','Predicted Plant SRP RNA');
INSERT INTO `DOWNLOAD_DESCRIPTION_LABEL` VALUES (45,'Predicted Protozoan signal recognition particle RNA (RF01856)','Predicted Protozoa SRP RNA');
INSERT INTO `DOWNLOAD_DESCRIPTION_LABEL` VALUES (46,'Predicted RNase MRP RNA (RF00030)','Predicted RNase MRP RNA');
INSERT INTO `DOWNLOAD_DESCRIPTION_LABEL` VALUES (47,'Predicted Archaeal RNase P RNA (RF00373)','Predicted Archaeal RNase P RNA');
INSERT INTO `DOWNLOAD_DESCRIPTION_LABEL` VALUES (48,'Predicted Bacterial RNase P class A (RF00010)','Predicted Bacterial RNase P class A RNA');
INSERT INTO `DOWNLOAD_DESCRIPTION_LABEL` VALUES (49,'Predicted Bacterial RNase P class B (RF00011)','Predicted Bacterial RNase P class B RNA');
INSERT INTO `DOWNLOAD_DESCRIPTION_LABEL` VALUES (50,'Predicted Plasmodium RNase P (RF01577)','Predicted Plasmodium RNase P');
INSERT INTO `DOWNLOAD_DESCRIPTION_LABEL` VALUES (51,'Predicted Nuclear RNase P (RF00009)','Predicted Nuclear RNase P');
INSERT INTO `DOWNLOAD_DESCRIPTION_LABEL` VALUES (52,'Predicted transfer-messenger RNA (RF00023)','Predicted tmRNA');
INSERT INTO `DOWNLOAD_DESCRIPTION_LABEL` VALUES (53,'Predicted transfer RNA (RF00005)','Predicted tRNA');
INSERT INTO `DOWNLOAD_DESCRIPTION_LABEL` VALUES (54,'Predicted Selenocysteine transfer RNA (RF01852)','Predicted tRNA-Sec');
INSERT INTO `DOWNLOAD_DESCRIPTION_LABEL` VALUES (55,'Predicted 5.8S ribosomal RNA (RF00002)','Predicted 5.8S rRNA');
INSERT INTO `DOWNLOAD_DESCRIPTION_LABEL` VALUES (56,'Predicted Bacterial small subunit ribosomal RNA (RF00177)','Predicted Bacterial SSU rRNA');
INSERT INTO `DOWNLOAD_DESCRIPTION_LABEL` VALUES (57,'Predicted Archaeal small subunit ribosomal RNA  (RF01959)','Predicted Archaeal SSU rRNA');
INSERT INTO `DOWNLOAD_DESCRIPTION_LABEL` VALUES (58,'Predicted Eukaryotic small subunit ribosomal RNA (RF01960)','Predicted Eukaryotic SSU rRNA');
INSERT INTO `DOWNLOAD_DESCRIPTION_LABEL` VALUES (59,'Predicted Archaeal large subunit ribosomal RNA  (RF02540)','Predicted Archaeal LSU rRNA');
INSERT INTO `DOWNLOAD_DESCRIPTION_LABEL` VALUES (60,'Predicted Bacterial large subunit ribosomal RNA (RF02541)','Predicted Bacterial LSU rRNA');
INSERT INTO `DOWNLOAD_DESCRIPTION_LABEL` VALUES (61,'Predicted Microsporidia small subunit ribosomal RNA (RF02542)','Predicted Microsporidia SSU rRNA');
INSERT INTO `DOWNLOAD_DESCRIPTION_LABEL` VALUES (62,'Predicted Eukaryotic large subunit ribosomal RNA (RF02543)','Predicted Eukaryotic LSU rRNA');
INSERT INTO `DOWNLOAD_DESCRIPTION_LABEL` VALUES (63,'Predicted Trypanosomatid mitochondrial large subunit ribosomal RNA (RF02546)','Predicted trypano mito LSU rRNA');
INSERT INTO `DOWNLOAD_DESCRIPTION_LABEL` VALUES (64,'Predicted Permuted mitochondrial genome encoded 5S rRNA (RF02547)','Predicted mtPerm-5S rRNA');
-- Dump completed on 2018-03-20 15:59:03