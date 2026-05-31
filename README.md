# Cloud Security & Compliance for Banking Application on AWS

## Project Overview

This project designs a **secure, compliant cloud architecture** for a banking application hosted on **Amazon Web Services (AWS)**. It focuses on security best practices and regulatory compliance (ISO 27001 & NIST CSF).  

**No actual AWS resources were created** – this is a complete design and documentation deliverable.

---

## Deliverables

| File | Description |
|------|-------------|
| `Security_Architecture_Document.pdf` | Full security design: IAM, network, encryption, key management, SOC dashboards, compliance mapping. |
| `Threat_Model_Diagrams.pdf` | Visual diagrams: Data Flow Diagram (DFD), STRIDE threat analysis, attack tree. |
| `Incident_Response_Plan.pdf` | Step‑by‑step playbooks for handling security incidents (compromised keys, data breach, DDoS, etc.). |
| `Compliance_Matrix.xlsx` (optional) | ISO 27001 & NIST CSF control mappings. |

---

## Key Topics Covered

- **IAM Least Privilege** – Roles, policies, MFA, no root user.  
- **Network Security** – VPC, public/private subnets, Security Groups, NACLs, AWS WAF.  
- **Encryption Strategy** – AES‑256 at rest, TLS 1.3 in transit, KMS key management.  
- **SOC Dashboards** – CloudWatch, GuardDuty, Security Hub for real‑time monitoring.  
- **Incident Response** – NIST 800‑61 phases, playbooks, containment steps.  
- **Threat Modeling** – STRIDE methodology, data flow diagrams, attack trees.  
- **Compliance** – ISO 27001:2022 and NIST CSF 2.0 mapping.

---

## How to Use This Repository

1. **Review the PDF documents** in order:  
   - Start with `Security_Architecture_Document.pdf` to understand the full design.  
   - Then see `Threat_Model_Diagrams.pdf` for visual threat analysis.  
   - Finally, `Incident_Response_Plan.pdf` for response procedures.  

2. **Use these as a reference** for similar cloud security projects or compliance audits.

---

## Technologies & Frameworks Referenced

- **AWS Services** – IAM, VPC, EC2, RDS, S3, KMS, WAF, CloudTrail, CloudWatch.  
- **Security Frameworks** – ISO 27001:2022, NIST Cybersecurity Framework 2.0.  
- **Threat Modeling** – STRIDE, DFD, attack trees.

---

## Author

**Priyanka Rode**

Project for – Cloud Security & Compliance Implementation.

---

## Note

This is a **design and documentation project** only. No actual AWS infrastructure was deployed. All diagrams were created using Draw.io / Mermaid.
