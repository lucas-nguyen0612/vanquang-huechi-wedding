Phase 2 — Planning (bắt buộc):                                                        
                                                                                        
  ┌─────┬───────────┬────────────────────────────┬────────────┬────────────────────┐    
  │  #  │ Workflow  │          Command           │   Agent    │       Mô tả        │ 
  ├─────┼───────────┼────────────────────────────┼────────────┼────────────────────┤    
  │     │ Create    │                            │            │ Tạo Product        │ 
  │ 1   │ PRD (bắt  │ /bmad-bmm-create-prd       │ 📋 John    │ Requirements       │ 
  │     │ buộc)     │                            │ (PM)       │ Document chi tiết  │    
  │     │           │                            │            │ từ Product Brief   │ 
  ├─────┼───────────┼────────────────────────────┼────────────┼────────────────────┤    
  │ 2   │ Validate  │ /bmad-bmm-validate-prd     │ 📋 John    │ Kiểm tra PRD đầy   │    
  │     │ PRD       │                            │ (PM)       │ đủ và nhất quán    │
  ├─────┼───────────┼────────────────────────────┼────────────┼────────────────────┤    
  │     │           │                            │ 🎨 Sally   │ Thiết kế UX chi    │
  │ 3   │ Create UX │ /bmad-bmm-create-ux-design │ (UX        │ tiết — rất khuyến  │    
  │     │  Design   │                            │ Designer)  │ khích vì JL-Tools  │
  │     │           │                            │            │ có UI phức tạp     │    
  └─────┴───────────┴────────────────────────────┴────────────┴────────────────────┘

  Phase 3 — Solutioning (bắt buộc):

  #: 4                                                                                  
  Workflow: Create Architecture (bắt buộc)                                          
  Command: /bmad-bmm-create-architecture                                                
  Agent: 🏗️  Winston (Architect)                                                     
  Mô tả: Document technical decisions                                               
  ────────────────────────────────────────                                              
  #: 5                                                                              
  Workflow: Create Epics & Stories (bắt buộc)                                           
  Command: /bmad-bmm-create-epics-and-stories                                           
  Agent: 📋 John (PM)                                                              
  Mô tả: Tạo backlog chi tiết                                                           
  ────────────────────────────────────────                                         
  #: 6                                                                             
  Workflow: Check Implementation Readiness (bắt buộc)
  Command: /bmad-bmm-check-implementation-readiness                                     
  Agent: 🏗️  Winston (Architect)
  Mô tả: Validate tất cả docs trước khi code                                            
                                                            
  Lưu ý: Nên chạy mỗi workflow trong một context window mới để tối ưu chất lượng.




   Bước tiếp theo:

  #: 1
  Workflow: Validate PRD (khuyến khích)
  Command: /bmad-bmm-validate-prd
  Agent: 📋 John
  Mô tả: Kiểm tra PRD đầy đủ trước khi tiến hành
  ────────────────────────────────────────
  #: 2
  Workflow: Create UX Design
  Command: /bmad-bmm-create-ux-design
  Agent: 🎨 Sally
  Mô tả: Thiết kế UX chi tiết — rất khuyến khích vì JL-Tools có UI phức tạp
  ────────────────────────────────────────
  #: 3
  Workflow: Create Architecture (bắt buộc)
  Command: /bmad-bmm-create-architecture
  Agent: 🏗️  Winston
  Mô tả: Document technical decisions
  ────────────────────────────────────────
  #: 4
  Workflow: Create Epics & Stories (bắt buộc)
  Command: /bmad-bmm-create-epics-and-stories
  Agent: 📋 John
  Mô tả: Tạo backlog chi tiết

  Lưu ý: PRD là nền tảng cho mọi công việc tiếp theo. Mọi design, architecture, và
  development đều trace back về document này. Cập nhật PRD khi cần trong quá trình
  planning.

  Nên chạy mỗi workflow trong context window mới để tối ưu chất lượng. Lucas muốn
  tiếp tục với bước nào?