-- MySQL dump 10.13  Distrib 5.7.17, for macos10.12 (x86_64)
--
-- Host: 127.0.0.1    Database: emg
-- ------------------------------------------------------
-- Server version	5.7.20

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
-- Dumping data for table ANALYSIS_JOB_DOWNLOAD
--

LOCK TABLES ANALYSIS_JOB_DOWNLOAD WRITE;
/*!40000 ALTER TABLE ANALYSIS_JOB_DOWNLOAD DISABLE KEYS */;
INSERT INTO ANALYSIS_JOB_DOWNLOAD  (id, REAL_NAME, ALIAS, DESCRIPTION_ID, FORMAT_ID, GROUP_ID, JOB_ID, PARENT_DOWNLOAD_ID, PIPELINE_ID, SUBDIR_ID) VALUES (221924,'tad-plots.svg','ERR1111102_MERGED_FASTQ_tad-plots.svg',34,10,6,67696,NULL,3,12),(2321651,'ERR1022502_FASTQ_I5_1.tsv.gz','ERR1022502_FASTQ_InterPro_1.tsv.gz',20,1,2,11845,NULL,2,NULL),(2321652,'ERR1022502_FASTQ_1.fasta.gz','ERR1022502_FASTQ_1.fasta.gz',1,4,1,11845,NULL,2,NULL),(2321653,'pCDS_1.fasta.gz','ERR1022502_FASTQ_readsWithpCDS_1.fasta.gz',4,4,1,11845,NULL,2,6),(2321654,'interproscan.fasta.gz','ERR1022502_FASTQ_interproscan.fasta.gz',5,4,1,11845,NULL,2,6),(2321655,'noFunction_1.fasta.gz','ERR1022502_FASTQ_noFunction_1.fasta.gz',6,4,1,11845,NULL,2,6),(2321656,'ERR1022502_FASTQ_CDS_1.faa.gz','ERR1022502_FASTQ_CDS_1.faa.gz',7,4,1,11845,NULL,2,NULL),(2321657,'ERR1022502_FASTQ_CDS_unannotated_1.faa.gz','ERR1022502_FASTQ_CDS_unannotated_1.faa.gz',9,4,1,11845,NULL,2,NULL),(2321658,'ERR1022502_FASTQ_CDS_unannotated_1.ffn.gz','ERR1022502_FASTQ_ORF_unannotated_1.ffn.gz',10,4,1,11845,NULL,2,NULL),(2321659,'ERR1022502_FASTQ_summary.go','ERR1022502_FASTQ_GO.csv',21,3,2,11845,NULL,2,NULL),(2321660,'ERR1022502_FASTQ_summary.go_slim','ERR1022502_FASTQ_GO_slim.csv',22,3,2,11845,NULL,2,NULL),(2321661,'5S.fasta','ERR1022502_FASTQ_5SrRNA.fasta',11,5,3,11845,NULL,2,6),(2321662,'16S.fasta','ERR1022502_FASTQ_16SrRNA.fasta',12,5,3,11845,NULL,2,6),(2321663,'23S.fasta','ERR1022502_FASTQ_23SrRNA.fasta',13,5,3,11845,NULL,2,6),(2321664,'rep_set.tre','ERR1022502_FASTQ_pruned.tree',15,9,3,11845,NULL,2,9),(2321665,'ERR1022502_FASTQ_otu_table.txt','ERR1022502_FASTQ_otu.tsv',14,2,3,11845,NULL,2,9),(2321666,'ERR1022502_FASTQ_otu_table_json.biom','ERR1022502_FASTQ_otu_table_json.biom',14,8,3,11845,NULL,2,9),(2321667,'ERR1022502_FASTQ_otu_table_hdf5.biom','ERR1022502_FASTQ_otu_table_hdf5.biom',14,7,3,11845,NULL,2,9),(2321668,'ERR1022502_FASTQ_I5_2.tsv.gz','ERR1022502_FASTQ_InterPro_2.tsv.gz',20,1,2,11845,2321651,2,NULL),(2321669,'ERR1022502_FASTQ_I5_3.tsv.gz','ERR1022502_FASTQ_InterPro_3.tsv.gz',20,1,2,11845,2321651,2,NULL),(2321670,'ERR1022502_FASTQ_10.fasta.gz','ERR1022502_FASTQ_10.fasta.gz',1,4,1,11845,2321652,2,NULL),(2321671,'ERR1022502_FASTQ_11.fasta.gz','ERR1022502_FASTQ_11.fasta.gz',1,4,1,11845,2321652,2,NULL),(2321672,'ERR1022502_FASTQ_12.fasta.gz','ERR1022502_FASTQ_12.fasta.gz',1,4,1,11845,2321652,2,NULL),(2321673,'ERR1022502_FASTQ_13.fasta.gz','ERR1022502_FASTQ_13.fasta.gz',1,4,1,11845,2321652,2,NULL),(2321674,'ERR1022502_FASTQ_2.fasta.gz','ERR1022502_FASTQ_2.fasta.gz',1,4,1,11845,2321652,2,NULL),(2321675,'ERR1022502_FASTQ_3.fasta.gz','ERR1022502_FASTQ_3.fasta.gz',1,4,1,11845,2321652,2,NULL),(2321676,'ERR1022502_FASTQ_4.fasta.gz','ERR1022502_FASTQ_4.fasta.gz',1,4,1,11845,2321652,2,NULL),(2321677,'ERR1022502_FASTQ_5.fasta.gz','ERR1022502_FASTQ_5.fasta.gz',1,4,1,11845,2321652,2,NULL),(2321678,'ERR1022502_FASTQ_6.fasta.gz','ERR1022502_FASTQ_6.fasta.gz',1,4,1,11845,2321652,2,NULL),(2321679,'ERR1022502_FASTQ_7.fasta.gz','ERR1022502_FASTQ_7.fasta.gz',1,4,1,11845,2321652,2,NULL),(2321680,'ERR1022502_FASTQ_8.fasta.gz','ERR1022502_FASTQ_8.fasta.gz',1,4,1,11845,2321652,2,NULL),(2321681,'ERR1022502_FASTQ_9.fasta.gz','ERR1022502_FASTQ_9.fasta.gz',1,4,1,11845,2321652,2,NULL),(2321682,'pCDS_2.fasta.gz','ERR1022502_FASTQ_readsWithpCDS_2.fasta.gz',4,4,1,11845,2321653,2,6),(2321683,'pCDS_3.fasta.gz','ERR1022502_FASTQ_readsWithpCDS_3.fasta.gz',4,4,1,11845,2321653,2,6),(2321684,'pCDS_4.fasta.gz','ERR1022502_FASTQ_readsWithpCDS_4.fasta.gz',4,4,1,11845,2321653,2,6),(2321685,'pCDS_5.fasta.gz','ERR1022502_FASTQ_readsWithpCDS_5.fasta.gz',4,4,1,11845,2321653,2,6),(2321686,'pCDS_6.fasta.gz','ERR1022502_FASTQ_readsWithpCDS_6.fasta.gz',4,4,1,11845,2321653,2,6),(2321687,'pCDS_7.fasta.gz','ERR1022502_FASTQ_readsWithpCDS_7.fasta.gz',4,4,1,11845,2321653,2,6),(2321688,'pCDS_8.fasta.gz','ERR1022502_FASTQ_readsWithpCDS_8.fasta.gz',4,4,1,11845,2321653,2,6),(2321689,'pCDS_9.fasta.gz','ERR1022502_FASTQ_readsWithpCDS_9.fasta.gz',4,4,1,11845,2321653,2,6),(2321690,'noFunction_2.fasta.gz','ERR1022502_FASTQ_noFunction_2.fasta.gz',6,4,1,11845,2321655,2,6),(2321691,'noFunction_3.fasta.gz','ERR1022502_FASTQ_noFunction_3.fasta.gz',6,4,1,11845,2321655,2,6),(2321692,'noFunction_4.fasta.gz','ERR1022502_FASTQ_noFunction_4.fasta.gz',6,4,1,11845,2321655,2,6),(2321693,'noFunction_5.fasta.gz','ERR1022502_FASTQ_noFunction_5.fasta.gz',6,4,1,11845,2321655,2,6),(2321694,'noFunction_6.fasta.gz','ERR1022502_FASTQ_noFunction_6.fasta.gz',6,4,1,11845,2321655,2,6),(2321695,'noFunction_7.fasta.gz','ERR1022502_FASTQ_noFunction_7.fasta.gz',6,4,1,11845,2321655,2,6),(2321696,'noFunction_8.fasta.gz','ERR1022502_FASTQ_noFunction_8.fasta.gz',6,4,1,11845,2321655,2,6),(2321697,'ERR1022502_FASTQ_CDS_2.faa.gz','ERR1022502_FASTQ_CDS_2.faa.gz',7,4,1,11845,2321656,2,NULL),(2321698,'ERR1022502_FASTQ_CDS_3.faa.gz','ERR1022502_FASTQ_CDS_3.faa.gz',7,4,1,11845,2321656,2,NULL),(2321699,'ERR1022502_FASTQ_CDS_4.faa.gz','ERR1022502_FASTQ_CDS_4.faa.gz',7,4,1,11845,2321656,2,NULL),(2321700,'ERR1022502_FASTQ_CDS_5.faa.gz','ERR1022502_FASTQ_CDS_5.faa.gz',7,4,1,11845,2321656,2,NULL),(2321701,'ERR1022502_FASTQ_CDS_6.faa.gz','ERR1022502_FASTQ_CDS_6.faa.gz',7,4,1,11845,2321656,2,NULL),(2321702,'ERR1022502_FASTQ_CDS_7.faa.gz','ERR1022502_FASTQ_CDS_7.faa.gz',7,4,1,11845,2321656,2,NULL),(2321703,'ERR1022502_FASTQ_CDS_unannotated_2.faa.gz','ERR1022502_FASTQ_CDS_unannotated_2.faa.gz',9,4,1,11845,2321657,2,NULL),(2321704,'ERR1022502_FASTQ_CDS_unannotated_3.faa.gz','ERR1022502_FASTQ_CDS_unannotated_3.faa.gz',9,4,1,11845,2321657,2,NULL),(2321705,'ERR1022502_FASTQ_CDS_unannotated_4.faa.gz','ERR1022502_FASTQ_CDS_unannotated_4.faa.gz',9,4,1,11845,2321657,2,NULL),(2321706,'ERR1022502_FASTQ_CDS_unannotated_5.faa.gz','ERR1022502_FASTQ_CDS_unannotated_5.faa.gz',9,4,1,11845,2321657,2,NULL),(2321707,'ERR1022502_FASTQ_CDS_unannotated_6.faa.gz','ERR1022502_FASTQ_CDS_unannotated_6.faa.gz',9,4,1,11845,2321657,2,NULL),(2321708,'ERR1022502_FASTQ_CDS_unannotated_2.ffn.gz','ERR1022502_FASTQ_ORF_unannotated_2.ffn.gz',10,4,1,11845,2321658,2,NULL),(2321709,'ERR1022502_FASTQ_CDS_unannotated_3.ffn.gz','ERR1022502_FASTQ_ORF_unannotated_3.ffn.gz',10,4,1,11845,2321658,2,NULL),(2321710,'ERR1022502_FASTQ_CDS_unannotated_4.ffn.gz','ERR1022502_FASTQ_ORF_unannotated_4.ffn.gz',10,4,1,11845,2321658,2,NULL),(2321711,'ERR1022502_FASTQ_CDS_unannotated_5.ffn.gz','ERR1022502_FASTQ_ORF_unannotated_5.ffn.gz',10,4,1,11845,2321658,2,NULL),(2321712,'ERR1022502_FASTQ_CDS_unannotated_6.ffn.gz','ERR1022502_FASTQ_ORF_unannotated_6.ffn.gz',10,4,1,11845,2321658,2,NULL),(2321713,'ERR1022502_FASTQ_CDS_unannotated_7.ffn.gz','ERR1022502_FASTQ_ORF_unannotated_7.ffn.gz',10,4,1,11845,2321658,2,NULL),(2321714,'ERR1022502_FASTQ_CDS_unannotated_8.ffn.gz','ERR1022502_FASTQ_ORF_unannotated_8.ffn.gz',10,4,1,11845,2321658,2,NULL),(2322691,'ERR1022502_FASTQ_I5_1.tsv.gz','ERR1022502_FASTQ_InterPro_1.tsv.gz',20,1,2,141547,NULL,4,NULL),(2322692,'ERR1022502_FASTQ_1.fasta.gz','ERR1022502_FASTQ_1.fasta.gz',1,4,1,141547,NULL,4,NULL),(2322693,'pCDS_1.fasta.gz','ERR1022502_FASTQ_readsWithpCDS_1.fasta.gz',4,4,1,141547,NULL,4,6),(2322694,'interproscan_1.fasta.gz','ERR1022502_FASTQ_interproscan_1.fasta.gz',5,4,1,141547,NULL,4,6),(2322695,'noFunction_1.fasta.gz','ERR1022502_FASTQ_noFunction_1.fasta.gz',6,4,1,141547,NULL,4,6),(2322696,'ERR1022502_FASTQ_CDS_annotated_1.faa.gz','ERR1022502_FASTQ_CDS_annotated_1.faa.gz',8,4,1,141547,NULL,4,NULL),(2322697,'ERR1022502_FASTQ_CDS_unannotated_1.faa.gz','ERR1022502_FASTQ_CDS_unannotated_1.faa.gz',9,4,1,141547,NULL,4,NULL),(2322698,'ERR1022502_FASTQ_CDS_unannotated_1.ffn.gz','ERR1022502_FASTQ_ORF_unannotated_1.ffn.gz',10,4,1,141547,NULL,4,NULL),(2322699,'SSU.fasta.gz','ERR1022502_FASTQ_SSU.fasta.gz',16,4,4,141547,NULL,4,6),(2322700,'LSU.fasta.gz','ERR1022502_FASTQ_LSU.fasta.gz',18,4,5,141547,NULL,4,6),(2322701,'ERR1022502_FASTQ_summary.go','ERR1022502_FASTQ_GO.csv',21,3,2,141547,NULL,4,NULL),(2322702,'ERR1022502_FASTQ_summary.go_slim','ERR1022502_FASTQ_GO_slim.csv',22,3,2,141547,NULL,4,NULL),(2322703,'ERR1022502_FASTQ_LSU.fasta.mseq.tsv','ERR1022502_FASTQ_LSU_OTU.tsv',18,2,5,141547,NULL,4,16),(2322704,'ERR1022502_FASTQ_LSU.fasta.mseq_json.biom','ERR1022502_FASTQ_LSU_OTU_TABLE_JSON.biom',19,8,5,141547,NULL,4,16),(2322705,'ERR1022502_FASTQ_LSU.fasta.mseq_hdf5.biom','ERR1022502_FASTQ_LSU_OTU_TABLE_HDF5.biom',19,7,5,141547,NULL,4,16),(2322706,'ERR1022502_FASTQ_SSU.fasta.mseq.tsv','ERR1022502_FASTQ_SSU_OTU.tsv',16,2,4,141547,NULL,4,15),(2322707,'ERR1022502_FASTQ_SSU.fasta.mseq_json.biom','ERR1022502_FASTQ_SSU_OTU_TABLE_JSON.biom',17,8,4,141547,NULL,4,15),(2322708,'ERR1022502_FASTQ_SSU.fasta.mseq_hdf5.biom','ERR1022502_FASTQ_SSU_OTU_TABLE_HDF5.biom',17,7,4,141547,NULL,4,15),(2322709,'ERR1022502.Bacteria_large_SRP.RF01854.fa','ERR1022502.Bacteria_large_SRP.RF01854.fa',36,5,7,141547,NULL,4,14),(2322710,'ERR1022502.5_8S_rRNA.RF00002.fa','ERR1022502.5_8S_rRNA.RF00002.fa',55,5,7,141547,NULL,4,14),(2322711,'ERR1022502.Bacteria_small_SRP.RF00169.fa','ERR1022502.Bacteria_small_SRP.RF00169.fa',37,5,7,141547,NULL,4,14),(2322712,'ERR1022502.LSU_rRNA_archaea.RF02540.fa','ERR1022502.LSU_rRNA_archaea.RF02540.fa',59,5,7,141547,NULL,4,14),(2322713,'ERR1022502.LSU_rRNA_bacteria.RF02541.fa','ERR1022502.LSU_rRNA_bacteria.RF02541.fa',60,5,7,141547,NULL,4,14),(2322714,'ERR1022502.LSU_rRNA_eukarya.RF02543.fa','ERR1022502.LSU_rRNA_eukarya.RF02543.fa',62,5,7,141547,NULL,4,14),(2322715,'ERR1022502.Metazoa_SRP.RF00017.fa','ERR1022502.Metazoa_SRP.RF00017.fa',42,5,7,141547,NULL,4,14),(2322716,'ERR1022502.RNaseP_nuc.RF00009.fa','ERR1022502.RNaseP_nuc.RF00009.fa',51,5,7,141547,NULL,4,14),(2322717,'ERR1022502.SSU_rRNA_archaea.RF01959.fa','ERR1022502.SSU_rRNA_archaea.RF01959.fa',57,5,7,141547,NULL,4,14),(2322718,'ERR1022502.SSU_rRNA_bacteria.RF00177.fa','ERR1022502.SSU_rRNA_bacteria.RF00177.fa',56,5,7,141547,NULL,4,14),(2322719,'ERR1022502.SSU_rRNA_eukarya.RF01960.fa','ERR1022502.SSU_rRNA_eukarya.RF01960.fa',58,5,7,141547,NULL,4,14),(2322720,'ERR1022502.tRNA-Sec.RF01852.fa','ERR1022502.tRNA-Sec.RF01852.fa',54,5,7,141547,NULL,4,14),(2322721,'ERR1022502.tRNA.RF00005.fa','ERR1022502.tRNA.RF00005.fa',53,5,7,141547,NULL,4,14),(2322722,'ERR1022502.tmRNA.RF00023.fa','ERR1022502.tmRNA.RF00023.fa',52,5,7,141547,NULL,4,14),(2322723,'ERR1022502_FASTQ_I5_2.tsv.gz','ERR1022502_FASTQ_InterPro_2.tsv.gz',20,1,2,141547,2322691,4,NULL),(2322724,'ERR1022502_FASTQ_10.fasta.gz','ERR1022502_FASTQ_10.fasta.gz',1,4,1,141547,2322692,4,NULL),(2322725,'ERR1022502_FASTQ_11.fasta.gz','ERR1022502_FASTQ_11.fasta.gz',1,4,1,141547,2322692,4,NULL),(2322726,'ERR1022502_FASTQ_12.fasta.gz','ERR1022502_FASTQ_12.fasta.gz',1,4,1,141547,2322692,4,NULL),(2322727,'ERR1022502_FASTQ_13.fasta.gz','ERR1022502_FASTQ_13.fasta.gz',1,4,1,141547,2322692,4,NULL),(2322728,'ERR1022502_FASTQ_14.fasta.gz','ERR1022502_FASTQ_14.fasta.gz',1,4,1,141547,2322692,4,NULL),(2322729,'ERR1022502_FASTQ_15.fasta.gz','ERR1022502_FASTQ_15.fasta.gz',1,4,1,141547,2322692,4,NULL),(2322730,'ERR1022502_FASTQ_16.fasta.gz','ERR1022502_FASTQ_16.fasta.gz',1,4,1,141547,2322692,4,NULL),(2322731,'ERR1022502_FASTQ_2.fasta.gz','ERR1022502_FASTQ_2.fasta.gz',1,4,1,141547,2322692,4,NULL),(2322732,'ERR1022502_FASTQ_3.fasta.gz','ERR1022502_FASTQ_3.fasta.gz',1,4,1,141547,2322692,4,NULL),(2322733,'ERR1022502_FASTQ_4.fasta.gz','ERR1022502_FASTQ_4.fasta.gz',1,4,1,141547,2322692,4,NULL),(2322734,'ERR1022502_FASTQ_5.fasta.gz','ERR1022502_FASTQ_5.fasta.gz',1,4,1,141547,2322692,4,NULL),(2322735,'ERR1022502_FASTQ_6.fasta.gz','ERR1022502_FASTQ_6.fasta.gz',1,4,1,141547,2322692,4,NULL),(2322736,'ERR1022502_FASTQ_7.fasta.gz','ERR1022502_FASTQ_7.fasta.gz',1,4,1,141547,2322692,4,NULL),(2322737,'ERR1022502_FASTQ_8.fasta.gz','ERR1022502_FASTQ_8.fasta.gz',1,4,1,141547,2322692,4,NULL),(2322738,'ERR1022502_FASTQ_9.fasta.gz','ERR1022502_FASTQ_9.fasta.gz',1,4,1,141547,2322692,4,NULL),(2322739,'pCDS_10.fasta.gz','ERR1022502_FASTQ_readsWithpCDS_10.fasta.gz',4,4,1,141547,2322693,4,6),(2322740,'pCDS_11.fasta.gz','ERR1022502_FASTQ_readsWithpCDS_11.fasta.gz',4,4,1,141547,2322693,4,6),(2322741,'pCDS_2.fasta.gz','ERR1022502_FASTQ_readsWithpCDS_2.fasta.gz',4,4,1,141547,2322693,4,6),(2322742,'pCDS_3.fasta.gz','ERR1022502_FASTQ_readsWithpCDS_3.fasta.gz',4,4,1,141547,2322693,4,6),(2322743,'pCDS_4.fasta.gz','ERR1022502_FASTQ_readsWithpCDS_4.fasta.gz',4,4,1,141547,2322693,4,6),(2322744,'pCDS_5.fasta.gz','ERR1022502_FASTQ_readsWithpCDS_5.fasta.gz',4,4,1,141547,2322693,4,6),(2322745,'pCDS_6.fasta.gz','ERR1022502_FASTQ_readsWithpCDS_6.fasta.gz',4,4,1,141547,2322693,4,6),(2322746,'pCDS_7.fasta.gz','ERR1022502_FASTQ_readsWithpCDS_7.fasta.gz',4,4,1,141547,2322693,4,6),(2322747,'pCDS_8.fasta.gz','ERR1022502_FASTQ_readsWithpCDS_8.fasta.gz',4,4,1,141547,2322693,4,6),(2322748,'pCDS_9.fasta.gz','ERR1022502_FASTQ_readsWithpCDS_9.fasta.gz',4,4,1,141547,2322693,4,6),(2322749,'interproscan_2.fasta.gz','ERR1022502_FASTQ_interproscan_2.fasta.gz',5,4,1,141547,2322694,4,6),(2322750,'noFunction_10.fasta.gz','ERR1022502_FASTQ_noFunction_10.fasta.gz',6,4,1,141547,2322695,4,6),(2322751,'noFunction_2.fasta.gz','ERR1022502_FASTQ_noFunction_2.fasta.gz',6,4,1,141547,2322695,4,6),(2322752,'noFunction_3.fasta.gz','ERR1022502_FASTQ_noFunction_3.fasta.gz',6,4,1,141547,2322695,4,6),(2322753,'noFunction_4.fasta.gz','ERR1022502_FASTQ_noFunction_4.fasta.gz',6,4,1,141547,2322695,4,6),(2322754,'noFunction_5.fasta.gz','ERR1022502_FASTQ_noFunction_5.fasta.gz',6,4,1,141547,2322695,4,6),(2322755,'noFunction_6.fasta.gz','ERR1022502_FASTQ_noFunction_6.fasta.gz',6,4,1,141547,2322695,4,6),(2322756,'noFunction_7.fasta.gz','ERR1022502_FASTQ_noFunction_7.fasta.gz',6,4,1,141547,2322695,4,6),(2322757,'noFunction_8.fasta.gz','ERR1022502_FASTQ_noFunction_8.fasta.gz',6,4,1,141547,2322695,4,6),(2322758,'noFunction_9.fasta.gz','ERR1022502_FASTQ_noFunction_9.fasta.gz',6,4,1,141547,2322695,4,6),(2322759,'ERR1022502_FASTQ_CDS_annotated_2.faa.gz','ERR1022502_FASTQ_CDS_annotated_2.faa.gz',8,4,1,141547,2322696,4,NULL),(2322760,'ERR1022502_FASTQ_CDS_unannotated_2.faa.gz','ERR1022502_FASTQ_CDS_unannotated_2.faa.gz',9,4,1,141547,2322697,4,NULL),(2322761,'ERR1022502_FASTQ_CDS_unannotated_3.faa.gz','ERR1022502_FASTQ_CDS_unannotated_3.faa.gz',9,4,1,141547,2322697,4,NULL),(2322762,'ERR1022502_FASTQ_CDS_unannotated_4.faa.gz','ERR1022502_FASTQ_CDS_unannotated_4.faa.gz',9,4,1,141547,2322697,4,NULL),(2322763,'ERR1022502_FASTQ_CDS_unannotated_5.faa.gz','ERR1022502_FASTQ_CDS_unannotated_5.faa.gz',9,4,1,141547,2322697,4,NULL),(2322764,'ERR1022502_FASTQ_CDS_unannotated_6.faa.gz','ERR1022502_FASTQ_CDS_unannotated_6.faa.gz',9,4,1,141547,2322697,4,NULL),(2322765,'ERR1022502_FASTQ_CDS_unannotated_7.faa.gz','ERR1022502_FASTQ_CDS_unannotated_7.faa.gz',9,4,1,141547,2322697,4,NULL),(2322766,'ERR1022502_FASTQ_CDS_unannotated_8.faa.gz','ERR1022502_FASTQ_CDS_unannotated_8.faa.gz',9,4,1,141547,2322697,4,NULL),(2322767,'ERR1022502_FASTQ_CDS_unannotated_10.ffn.gz','ERR1022502_FASTQ_ORF_unannotated_10.ffn.gz',10,4,1,141547,2322698,4,NULL),(2322768,'ERR1022502_FASTQ_CDS_unannotated_2.ffn.gz','ERR1022502_FASTQ_ORF_unannotated_2.ffn.gz',10,4,1,141547,2322698,4,NULL),(2322769,'ERR1022502_FASTQ_CDS_unannotated_3.ffn.gz','ERR1022502_FASTQ_ORF_unannotated_3.ffn.gz',10,4,1,141547,2322698,4,NULL),(2322770,'ERR1022502_FASTQ_CDS_unannotated_4.ffn.gz','ERR1022502_FASTQ_ORF_unannotated_4.ffn.gz',10,4,1,141547,2322698,4,NULL),(2322771,'ERR1022502_FASTQ_CDS_unannotated_5.ffn.gz','ERR1022502_FASTQ_ORF_unannotated_5.ffn.gz',10,4,1,141547,2322698,4,NULL),(2322772,'ERR1022502_FASTQ_CDS_unannotated_6.ffn.gz','ERR1022502_FASTQ_ORF_unannotated_6.ffn.gz',10,4,1,141547,2322698,4,NULL),(2322773,'ERR1022502_FASTQ_CDS_unannotated_7.ffn.gz','ERR1022502_FASTQ_ORF_unannotated_7.ffn.gz',10,4,1,141547,2322698,4,NULL),(2322774,'ERR1022502_FASTQ_CDS_unannotated_8.ffn.gz','ERR1022502_FASTQ_ORF_unannotated_8.ffn.gz',10,4,1,141547,2322698,4,NULL),(2322775,'ERR1022502_FASTQ_CDS_unannotated_9.ffn.gz','ERR1022502_FASTQ_ORF_unannotated_9.ffn.gz',10,4,1,141547,2322698,4,NULL);
/*!40000 ALTER TABLE ANALYSIS_JOB_DOWNLOAD ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2018-10-10 12:11:49
