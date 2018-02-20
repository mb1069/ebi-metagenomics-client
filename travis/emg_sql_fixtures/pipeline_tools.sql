/*
-- Query: SELECT * FROM PIPELINE_TOOL
LIMIT 0, 50000

-- Date: 2018-02-20 11:13
*/
INSERT INTO `PIPELINE_TOOL` (`TOOL_ID`,`TOOL_NAME`,`DESCRIPTION`,`WEB_LINK`,`VERSION`,`EXE_COMMAND`,`INSTALLATION_DIR`,`CONFIGURATION_FILE`,`NOTES`) VALUES (1,'Trimmomatic','A flexible read trimming tool.','http://www.usadellab.org/cms/?page=trimmomatic','0.32','java -classpath {0}/Trimmomatic-0.32/trimmomatic-0.32.jar org.usadellab.trimmomatic.TrimmomaticSE  -phred33 {1} {2} LEADING:3 TRAILING:3 SLIDINGWINDOW:4:15','/nfs/seqdb/production/interpro/development/metagenomics/pipeline/tools/Trimmomatic-0.32/trimmomatic-0.32.jar',NULL,NULL);
INSERT INTO `PIPELINE_TOOL` (`TOOL_ID`,`TOOL_NAME`,`DESCRIPTION`,`WEB_LINK`,`VERSION`,`EXE_COMMAND`,`INSTALLATION_DIR`,`CONFIGURATION_FILE`,`NOTES`) VALUES (2,'FragGeneScan','An application for finding fragmented genes in short reads.','http://omics.informatics.indiana.edu/FragGeneScan/','1.15','./FragGeneScan -s {0} -o {0}_CDS -w 0 -t 454_10','/nfs/seqdb/production/interpro/development/metagenomics/pipeline/tools/FragGeneScan1.15/FragGeneScan',NULL,NULL);
INSERT INTO `PIPELINE_TOOL` (`TOOL_ID`,`TOOL_NAME`,`DESCRIPTION`,`WEB_LINK`,`VERSION`,`EXE_COMMAND`,`INSTALLATION_DIR`,`CONFIGURATION_FILE`,`NOTES`) VALUES (3,'InterProScan','A sequence analysis application (nucleotide and protein sequences) that combines different protein signature recognition methods into one resource.','https://github.com/ebi-pf-team/interproscan/wiki','5.0-beta','./interproscan.sh --appl PfamA,TIGRFAM-10.1,PRINTS,PrositePatterns,Gene3d -goterms -o {1}_out.tsv -i {1}','/nfs/seqdb/production/interpro/development/metagenomics/pipeline/tools/interproscan-5-dist.dir/',NULL,NULL);
INSERT INTO `PIPELINE_TOOL` (`TOOL_ID`,`TOOL_NAME`,`DESCRIPTION`,`WEB_LINK`,`VERSION`,`EXE_COMMAND`,`INSTALLATION_DIR`,`CONFIGURATION_FILE`,`NOTES`) VALUES (4,'UCLUST','A high-performance clustering, alignment and search algorithm.','http://www.drive5.com/uclust/downloads1_1_579.html','1.1.579','./uclust1.1.579_i86linux64 --id 0.99 --usersort --nucleo --input {1} --uc {2}','/nfs/seqdb/production/interpro/development/metagenomics/pipeline/tools/uclust1.1.579_i86linux64',NULL,NULL);
INSERT INTO `PIPELINE_TOOL` (`TOOL_ID`,`TOOL_NAME`,`DESCRIPTION`,`WEB_LINK`,`VERSION`,`EXE_COMMAND`,`INSTALLATION_DIR`,`CONFIGURATION_FILE`,`NOTES`) VALUES (5,'RepeatMasker','A program that screens DNA sequences for interspersed repeats and low complexity DNA sequences.','http://www.repeatmasker.org/','3.2.2','./RepeatMasker {0}','/sw/arch/bin/RepeatMasker',NULL,NULL);
INSERT INTO `PIPELINE_TOOL` (`TOOL_ID`,`TOOL_NAME`,`DESCRIPTION`,`WEB_LINK`,`VERSION`,`EXE_COMMAND`,`INSTALLATION_DIR`,`CONFIGURATION_FILE`,`NOTES`) VALUES (6,'rRNASelector','A computer program for selecting ribosomal RNA encoding sequences from metagenomic and metatranscriptomic shotgun libraries.','http://www.ezbiocloud.net/sw/rrnaselector','1.0.0','HMMER3.0/hmmsearch --tblout {0} --cpu 4 -E 1.0E-5  {1}/rRNASelector/lib/all.hmm {2} > /dev/null','/ebi/production/interpro/binaries/64_bit_Linux/HMMER3.0/hmmsearch',NULL,NULL);
INSERT INTO `PIPELINE_TOOL` (`TOOL_ID`,`TOOL_NAME`,`DESCRIPTION`,`WEB_LINK`,`VERSION`,`EXE_COMMAND`,`INSTALLATION_DIR`,`CONFIGURATION_FILE`,`NOTES`) VALUES (7,'QIIME','An open-source bioinformatics pipeline for performing taxonomic analysis from raw DNA sequencing data.','http://qiime.org/','1.5.0','./qiimeWrapper.sh  {1}  {2}','/nfs/seqdb/production/interpro/development/metagenomics/pipeline/tools/qiimeWrapper.sh',NULL,NULL);
INSERT INTO `PIPELINE_TOOL` (`TOOL_ID`,`TOOL_NAME`,`DESCRIPTION`,`WEB_LINK`,`VERSION`,`EXE_COMMAND`,`INSTALLATION_DIR`,`CONFIGURATION_FILE`,`NOTES`) VALUES (8,'Biopython','A set of freely available tools for biological computation written in Python.','http://www.biopython.org/','1.54','N/A',NULL,NULL,NULL);
INSERT INTO `PIPELINE_TOOL` (`TOOL_ID`,`TOOL_NAME`,`DESCRIPTION`,`WEB_LINK`,`VERSION`,`EXE_COMMAND`,`INSTALLATION_DIR`,`CONFIGURATION_FILE`,`NOTES`) VALUES (9,'rRNASelector','A computer program for selecting ribosomal RNA encoding sequences from metagenomic and metatranscriptomic shotgun libraries.','http://www.ezbiocloud.net/sw/rrnaselector','1.0.1','./pipelineDetectRRNA.sh {1} {2} {3}','/nfs/seqdb/production/interpro/development/metagenomics/pipeline/tools/bin/pipelineDetectRRNA.sh',NULL,NULL);
INSERT INTO `PIPELINE_TOOL` (`TOOL_ID`,`TOOL_NAME`,`DESCRIPTION`,`WEB_LINK`,`VERSION`,`EXE_COMMAND`,`INSTALLATION_DIR`,`CONFIGURATION_FILE`,`NOTES`) VALUES (10,'QIIME','An open-source bioinformatics pipeline for performing taxonomic analysis from raw DNA sequencing data.','http://qiime.org/','1.9.0','./qiime190Wrapper.sh  {1} {2} {3}','/nfs/seqdb/production/interpro/development/metagenomics/pipeline/tools/bin/qiime190Wrapper.sh',NULL,NULL);
INSERT INTO `PIPELINE_TOOL` (`TOOL_ID`,`TOOL_NAME`,`DESCRIPTION`,`WEB_LINK`,`VERSION`,`EXE_COMMAND`,`INSTALLATION_DIR`,`CONFIGURATION_FILE`,`NOTES`) VALUES (11,'Biopython','A set of freely available tools for biological computation written in Python.','http://biopython.org/wiki/Biopython','1.65','N/A',NULL,NULL,NULL);
INSERT INTO `PIPELINE_TOOL` (`TOOL_ID`,`TOOL_NAME`,`DESCRIPTION`,`WEB_LINK`,`VERSION`,`EXE_COMMAND`,`INSTALLATION_DIR`,`CONFIGURATION_FILE`,`NOTES`) VALUES (12,'InterProScan','A sequence analysis application (nucleotide and protein sequences) that combines different protein signature recognition methods into one resource.','https://github.com/ebi-pf-team/interproscan/wiki','5.9-50.0','./interproscan.sh --appl PfamA,TIGRFAM-10.1,PRINTS,PrositePatterns,Gene3d -goterms -o {1}_out.tsv -i {1}','/nfs/seqdb/production/interpro/development/metagenomics/pipeline/tools/interproscan-5/interproscan-5.9-50.0/',NULL,NULL);
INSERT INTO `PIPELINE_TOOL` (`TOOL_ID`,`TOOL_NAME`,`DESCRIPTION`,`WEB_LINK`,`VERSION`,`EXE_COMMAND`,`INSTALLATION_DIR`,`CONFIGURATION_FILE`,`NOTES`) VALUES (13,'QIIME','An open-source bioinformatics pipeline for performing taxonomic analysis from raw DNA sequencing data.','http://qiime.org/','1.9.1','./qiime-1.9.1-wrapper.sh {1} {2} {3} {4}','/panfs/nobackup/production/metagenomics/pipeline/tools/pipeline-version-3/qiime-1.9.1/qiime-1.9.1-wrapper.sh',NULL,NULL);
INSERT INTO `PIPELINE_TOOL` (`TOOL_ID`,`TOOL_NAME`,`DESCRIPTION`,`WEB_LINK`,`VERSION`,`EXE_COMMAND`,`INSTALLATION_DIR`,`CONFIGURATION_FILE`,`NOTES`) VALUES (14,'InterProScan','A sequence analysis application (nucleotide and protein sequences) that combines different protein signature recognition methods into one resource.','https://github.com/ebi-pf-team/interproscan/wiki','5.19-58.0','./interproscan.sh --appl PfamA,TIGRFAM,PRINTS,PrositePatterns,Gene3d --goterms --pathways -f tsv -o {1}_out.tsv -i {1}','/panfs/nobackup/production/metagenomics/pipeline/tools/interproscan-5/interproscan-5.19-58.0',NULL,NULL);
INSERT INTO `PIPELINE_TOOL` (`TOOL_ID`,`TOOL_NAME`,`DESCRIPTION`,`WEB_LINK`,`VERSION`,`EXE_COMMAND`,`INSTALLATION_DIR`,`CONFIGURATION_FILE`,`NOTES`) VALUES (15,'Trimmomatic','A flexible read trimming tool.','http://www.usadellab.org/cms/?page=trimmomatic','0.35','java -classpath {0}/Trimmomatic-0.35/trimmomatic-0.35.jar org.usadellab.trimmomatic.TrimmomaticSE -threads 8 -phred33 {1} {2} LEADING:3 TRAILING:3 SLIDINGWINDOW:4:15','/panfs/nobackup/production/metagenomics/pipeline/tools/pipeline-version-3/Trimmomatic-0.35/trimmomatic-0.35.jar',NULL,NULL);
INSERT INTO `PIPELINE_TOOL` (`TOOL_ID`,`TOOL_NAME`,`DESCRIPTION`,`WEB_LINK`,`VERSION`,`EXE_COMMAND`,`INSTALLATION_DIR`,`CONFIGURATION_FILE`,`NOTES`) VALUES (16,'FragGeneScan','An application for finding (fragmented) genes in short reads.','https://sourceforge.net/projects/fraggenescan/','1.20','./FragGeneScan -s {1} -o {1}_CDS -w 0 -t illumina_5 -p 8','/panfs/nobackup/production/metagenomics/pipeline/tools/FragGeneScan1.20/FragGeneScan',NULL,NULL);
INSERT INTO `PIPELINE_TOOL` (`TOOL_ID`,`TOOL_NAME`,`DESCRIPTION`,`WEB_LINK`,`VERSION`,`EXE_COMMAND`,`INSTALLATION_DIR`,`CONFIGURATION_FILE`,`NOTES`) VALUES (17,'SeqPrep','A program to merge paired end Illumina reads that are overlapping into a single longer read.','https://github.com/jstjohn/SeqPrep','1.1','?','/nfs/seqdb/production/interpro/development/metagenomics/pipeline/tools/bin/SeqPrep-1.1',NULL,NULL);
INSERT INTO `PIPELINE_TOOL` (`TOOL_ID`,`TOOL_NAME`,`DESCRIPTION`,`WEB_LINK`,`VERSION`,`EXE_COMMAND`,`INSTALLATION_DIR`,`CONFIGURATION_FILE`,`NOTES`) VALUES (18,'HMMER','A computer program for biosequence analysis using profile hidden Markov models.','http://hmmer.org','v3.1b1','./nhmmer --tblout $outpath/${file}_tRNAselect.txt --cpu 4 -T 20 tRNA.hmm $outpath/${file}.fna > /dev/null','/panfs/nobackup/production/metagenomics/pipeline/releases/mgpipeline-v3.0-rc1/analysis-pipeline/python/tools/RNASelector-1.0/binaries/64_bit_Linux/HMMER3.1b1',NULL,NULL);
INSERT INTO `PIPELINE_TOOL` (`TOOL_ID`,`TOOL_NAME`,`DESCRIPTION`,`WEB_LINK`,`VERSION`,`EXE_COMMAND`,`INSTALLATION_DIR`,`CONFIGURATION_FILE`,`NOTES`) VALUES (19,'InterProScan','A sequence analysis application (nucleotide and protein sequences) that combines different protein signature recognition methods into one resource.','https://github.com/ebi-pf-team/interproscan/wiki','5.25-64.0','./interproscan.sh -dp --appl PfamA,TIGRFAM,PRINTS,PrositePatterns,Gene3d --goterms --pathways -f tsv -o {1}_out.tsv -i {1}','/hps/nobackup/production/metagenomics/pipeline/tools-v4/interproscan-5.25-64.0/',NULL,NULL);
INSERT INTO `PIPELINE_TOOL` (`TOOL_ID`,`TOOL_NAME`,`DESCRIPTION`,`WEB_LINK`,`VERSION`,`EXE_COMMAND`,`INSTALLATION_DIR`,`CONFIGURATION_FILE`,`NOTES`) VALUES (20,'Prodigal','Prodigal (Prokaryotic Dynamic Programming Genefinding Algorithm) is a microbial (bacterial and archaeal) gene finding program.','https://github.com/hyattpd/prodigal/wiki','2.6.3','./prodigal -i {0} -o {1} -f sco -d {1}.ffn -a {1}.faa','/hps/nobackup/production/metagenomics/pipeline/tools-v4/Prodigal-2.6.3/',NULL,NULL);
INSERT INTO `PIPELINE_TOOL` (`TOOL_ID`,`TOOL_NAME`,`DESCRIPTION`,`WEB_LINK`,`VERSION`,`EXE_COMMAND`,`INSTALLATION_DIR`,`CONFIGURATION_FILE`,`NOTES`) VALUES (21,'Infernal','Infernal (\"INFERence of RNA ALignment\") is for searching DNA sequence databases for RNA structure and sequence similarities. It is an implementation of a special case of profile stochastic context-free grammars called covariance models (CMs). A CM is like a sequence profile, but it scores a combination of sequence consensus and RNA secondary structure consensus, so in many cases, it is more capable of identifying RNA homologs that conserve their secondary structure more than their primary sequence.','http://eddylab.org/infernal/','1.1.2','../infernal-1.1.2/src/cmsearch --hmmonly --noali --cut_ga --cpu 4 --tblout {1} -Z 1000 -o {2} {3} {4}','/hps/nobackup/production/metagenomics/pipeline/tools-v4/infernal-1.1.2/',NULL,NULL);
INSERT INTO `PIPELINE_TOOL` (`TOOL_ID`,`TOOL_NAME`,`DESCRIPTION`,`WEB_LINK`,`VERSION`,`EXE_COMMAND`,`INSTALLATION_DIR`,`CONFIGURATION_FILE`,`NOTES`) VALUES (22,'MAPseq','MAPseq is a set of fast and accurate sequence read classification tools designed to assign taxonomy and OTU classifications to ribosomal RNA sequences.','https://github.com/jfmrod/MAPseq/','1.2','./mapseq -nthreads 8 -outfmt simple {1} <customref.fasta> <customref.tax>','/hps/nobackup/production/metagenomics/pipeline/tools-v4/mapseq-1.2-linux/',NULL,NULL);
INSERT INTO `PIPELINE_TOOL` (`TOOL_ID`,`TOOL_NAME`,`DESCRIPTION`,`WEB_LINK`,`VERSION`,`EXE_COMMAND`,`INSTALLATION_DIR`,`CONFIGURATION_FILE`,`NOTES`) VALUES (23,'cmsearch deoverlap script','A tool, which removes lower scoring overlaps from cmsearch --tblout files.','https://github.com/nawrockie/cmsearch_tblout_deoverlap','0.01','./cmsearch_deoverlap.pl --clanin <claninfo-file> <matches-file>','/hps/nobackup/production/metagenomics/production-scripts/current/mgportal/analysis-pipeline/python/tools/RNASelection/scripts/',NULL,NULL);
INSERT INTO `PIPELINE_TOOL` (`TOOL_ID`,`TOOL_NAME`,`DESCRIPTION`,`WEB_LINK`,`VERSION`,`EXE_COMMAND`,`INSTALLATION_DIR`,`CONFIGURATION_FILE`,`NOTES`) VALUES (24,'SeqPrep','A program to merge paired end Illumina reads that are overlapping into a single longer read.','https://github.com/jstjohn/SeqPrep','1.2','?','/hps/nobackup/production/metagenomics/pipeline/tools-v4/SeqPrep-1.2/',NULL,NULL);
INSERT INTO `PIPELINE_TOOL` (`TOOL_ID`,`TOOL_NAME`,`DESCRIPTION`,`WEB_LINK`,`VERSION`,`EXE_COMMAND`,`INSTALLATION_DIR`,`CONFIGURATION_FILE`,`NOTES`) VALUES (25,'MAPseq','MAPseq is a set of fast and accurate sequence read classification tools designed to assign taxonomy and OTU classifications to ribosomal RNA sequences.','https://github.com/jfmrod/MAPseq/','1.2.2','./mapseq -nthreads 1 -outfmt simple {1} <customref.fasta> <customref.tax>','/hps/nobackup/production/metagenomics/pipeline/tools-v4/mapseq-1.2.2-linux/',NULL,NULL);
